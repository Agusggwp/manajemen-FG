<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || $request->user()->role !== 'ADMIN') {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
            }
            return redirect()->route('login')->with('error', 'Akses hanya untuk Admin.');
        }

        return $next($request);
    }
}
