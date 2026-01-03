<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'No autenticado');
        }

        // Obtener establecimiento activo si existe
        $establishmentId = $user->active_establishment_id;

        if (!$user->hasPermission($permission, $establishmentId)) {
            abort(403, 'No tienes permiso para realizar esta acción');
        }

        return $next($request);
    }
}
