<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;

class ForgotPasswordController extends Controller
{
    /**
     * Display the forgot password view.
     */
    public function showLinkRequestForm()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    /**
     * Handle an incoming password reset link request.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'Alamat email ini tidak terdaftar dalam sistem kami.',
            ])->onlyInput('email');
        }

        if ($user->status !== 'ACTIVE') {
            return back()->withErrors([
                'email' => 'Akun Anda sedang dinonaktifkan. Silakan hubungi Admin.',
            ])->onlyInput('email');
        }

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we may examine the response then see the message we
        // need to show to the user.
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            ActivityLogger::log(
                'FORGOT_PASSWORD_REQUEST',
                'AUTH',
                "Permintaan reset password dikirim untuk email {$user->email}."
            );

            return back()->with('success', 'Kami telah menginstruksikan pengiriman tautan reset password ke email Anda. Silakan periksa inbox/spam email Anda.');
        }

        return back()->withErrors([
            'email' => __($status),
        ])->onlyInput('email');
    }
}
