<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetActiveEstablishment
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        // Si el usuario está autenticado y es business
        if ($user && $user->type === 'business') {
            // Si no tiene establecimiento activo, establecer el primero
            if (!$user->active_establishment_id) {
                $firstEstablishment = $user->establishments()->first();
                if ($firstEstablishment) {
                    $user->update(['active_establishment_id' => $firstEstablishment->id]);
                }
            }
        }

        return $next($request);
    }
}
