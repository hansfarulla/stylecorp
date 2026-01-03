<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsProfessional
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Solo staff y freelancers pueden acceder al área profesional
        if (!in_array($user->role, ['staff', 'freelancer'])) {
            abort(403, 'No tienes acceso al panel de profesionales');
        }

        return $next($request);
    }
}
