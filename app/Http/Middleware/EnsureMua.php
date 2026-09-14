<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMua
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! in_array($request->user()->role, ['MUA', 'ADMIN'])) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized. Akses khusus MUA.'], 403);
            }
            return redirect()->route('login')->with('error', 'Akses hanya untuk Make Up Artist (MUA).');
        }

        return $next($request);
    }
}
