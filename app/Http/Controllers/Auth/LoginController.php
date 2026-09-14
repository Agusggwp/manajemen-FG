<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function showLoginForm()
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

        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            $user = Auth::user();

            if ($user->role === 'PHOTOGRAPHER') {
                if (is_null($user->email_verified_at)) {
                    Auth::logout();
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();

                    return back()->withErrors([
                        'email' => 'Email akun Anda belum diverifikasi. Silakan periksa inbox atau folder spam email Anda untuk mengaktifkannya.',
                    ]);
                }

                if ($user->status === 'PENDING') {
                    Auth::logout();
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();

                    return back()->withErrors([
                        'email' => 'Email Anda telah terverifikasi, namun akun Anda masih menunggu persetujuan dan aktivasi oleh Admin ARTDEVATA.',
                    ]);
                }
            }

            if ($user->status !== 'ACTIVE') {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return back()->withErrors([
                    'email' => 'Akun Anda sedang dinonaktifkan. Silakan hubungi Admin.',
                ]);
            }

            ActivityLogger::log('LOGIN', 'AUTH', "User {$user->name} ({$user->role}) berhasil login.");

            if ($user->role === 'ADMIN') {
                return redirect()->intended(route('admin.dashboard'));
            }

            // Ensure intended URL for non-admin doesn't point to admin routes (prevents redirect loop)
            $intended = session()->get('url.intended');
            if ($intended && str_contains($intended, '/admin')) {
                session()->forget('url.intended');
            }

            if ($user->role === 'MUA') {
                return redirect()->intended(route('mua.dashboard'));
            }

            return redirect()->intended(route('photographer.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Email atau password yang Anda masukkan salah.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            ActivityLogger::log('LOGOUT', 'AUTH', "User {$user->name} logout.");
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
