<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PhotographerActivationMail;
use App\Models\Mua;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class RegisterController extends Controller
{
    /**
     * Show the registration form.
     */
    public function showRegistrationForm()
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->role === 'ADMIN') {
                return redirect()->route('admin.dashboard');
            }
            if ($user->role === 'MUA') {
                return redirect()->route('mua.dashboard');
            }
            return redirect()->route('photographer.dashboard');
        }

        return Inertia::render('Auth/Register');
    }

    /**
     * Handle incoming registration request for photographer or MUA.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'role' => ['required', 'in:PHOTOGRAPHER,MUA'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(6)],
            'phone' => ['nullable', 'string', 'max:50'],
            'specialty' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'bio' => ['nullable', 'string'],
        ], [
            'role.in' => 'Peran pendaftaran harus Fotografer atau MUA.',
            'email.unique' => 'Email ini sudah terdaftar dalam sistem.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'password.min' => 'Kata sandi minimal harus 6 karakter.',
        ]);

        $role = $validated['role'];

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $role,
            'phone' => $validated['phone'] ?? null,
            'specialty' => $validated['specialty'] ?? null,
            'address' => $validated['address'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'status' => 'PENDING',
            'email_verified_at' => null,
        ]);

        if ($role === 'MUA') {
            Mua::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '-',
                'address' => $user->address,
                'specialty' => $user->specialty,
                'bio' => $user->bio,
                'status' => 'INACTIVE', // Activated when admin approves
            ]);
        }

        // Generate temporary signed URL valid for 60 minutes
        $activationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->getEmailForVerification()),
            ]
        );

        try {
            Mail::to($user->email)->send(new PhotographerActivationMail($user, $activationUrl));
        } catch (\Throwable $e) {
            Log::error("Gagal mengirim email aktivasi ke {$user->email}: " . $e->getMessage());
        }

        $roleLabel = $role === 'MUA' ? 'MUA (Make Up Artist)' : 'Fotografer';

        ActivityLogger::log(
            'REGISTER',
            'AUTH',
            "{$roleLabel} baru mendaftar: {$user->name} ({$user->email}). Menunggu verifikasi email dan aktivasi Admin.",
            $user->id
        );

        return redirect()->route('login')->with(
            'success',
            "Pendaftaran {$roleLabel} berhasil! Tautan verifikasi telah dikirim ke {$user->email}. Silakan periksa inbox atau folder spam email Anda untuk mengaktifkan akun."
        );
    }

    /**
     * Handle email activation via signed URL.
     */
    public function verifyEmail(Request $request, $id, $hash)
    {
        if (! $request->hasValidSignature()) {
            return redirect()->route('login')->with(
                'error',
                'Tautan verifikasi email tidak valid atau sudah kedaluwarsa. Silakan hubungi Admin.'
            );
        }

        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect()->route('login')->with(
                'error',
                'Tautan verifikasi tidak cocok dengan akun terkait.'
            );
        }

        if (is_null($user->email_verified_at)) {
            $user->email_verified_at = now();
            $user->save();

            ActivityLogger::log(
                'EMAIL_VERIFIED',
                'AUTH',
                "Fotografer {$user->name} ({$user->email}) telah berhasil memverifikasi email. Status akun: MENUNGGU AKTIVASI ADMIN.",
                $user->id
            );
        }

        return redirect()->route('login')->with(
            'success',
            "Email Anda berhasil diverifikasi! Akun Anda sedang menunggu peninjauan dan aktivasi oleh Admin ARTDEVATA. Anda akan dapat login setelah Admin menyetujui akun Anda."
        );
    }
}
