<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePhotographer
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! in_array($request->user()->role, ['PHOTOGRAPHER', 'ADMIN'])) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
            return redirect()->route('login')->with('error', 'Akses hanya untuk Photographer.');
        }

        return $next($request);
    }
}
