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
            return Auth::user()->role === 'ADMIN'
                ? redirect()->route('admin.dashboard')
                : redirect()->route('photographer.dashboard');
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
