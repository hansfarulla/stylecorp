<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsBusinessRole
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

        // Super admin siempre tiene acceso
        if ($user->role === 'super_admin') {
            return $next($request);
        }

        // Owners y managers tienen acceso directo
        if (in_array($user->role, ['owner', 'manager'])) {
            return $next($request);
        }

        // Para otros roles (staff, freelancer), verificar si tienen permisos granulares
        $establishmentId = $user->active_establishment_id;
        
        if ($establishmentId) {
            // Verificar si tiene al menos un permiso granular asignado para este establecimiento
            $hasAnyBusinessPermission = $user->permissions()
                ->where('permission_user.establishment_id', $establishmentId)
                ->where('permission_user.granted', true)
                ->exists();

            if ($hasAnyBusinessPermission) {
                return $next($request);
            }
        }

        abort(403, 'No tienes acceso al panel de gestión de negocios');
    }
}
