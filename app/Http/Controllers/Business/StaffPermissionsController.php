<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Permission;
use App\Models\Establishment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffPermissionsController extends Controller
{
    /**
     * Mostrar formulario de permisos granulares para un empleado
     */
    public function edit(Request $request, User $user)
    {
        $establishment = Establishment::findOrFail($request->user()->active_establishment_id);

        // Solo owners pueden gestionar permisos
        if ($request->user()->role !== 'owner') {
            abort(403, 'Solo los dueños pueden gestionar permisos.');
        }

        // Verificar que el usuario pertenece al establecimiento
        if (!$user->establishments()->where('establishments.id', $establishment->id)->exists()) {
            abort(404, 'El usuario no pertenece a este establecimiento.');
        }

        // No se pueden modificar permisos de owners ni super_admins
        if (in_array($user->role, ['owner', 'super_admin'])) {
            abort(403, 'No se pueden modificar permisos de dueños o super administradores.');
        }

        $permissions = Permission::orderBy('category')->orderBy('order')->get()->groupBy('category');
        
        // Obtener permisos actuales del usuario
        $userPermissions = $user->permissions()
            ->where('permission_user.establishment_id', $establishment->id)
            ->where('permission_user.granted', true)
            ->pluck('permissions.id')
            ->toArray();

        // Permisos del rol por defecto
        $rolePermissions = \App\Enums\UserRole::from($user->role)->permissions();

        return Inertia::render('business/staff/permissions', [
            'staff' => $user->load('establishments'),
            'permissions' => $permissions,
            'userPermissions' => $userPermissions,
            'rolePermissions' => $rolePermissions,
            'establishment' => $establishment,
        ]);
    }

    /**
     * Actualizar permisos granulares de un empleado
     */
    public function update(Request $request, User $user)
    {
        $establishment = Establishment::findOrFail($request->user()->active_establishment_id);

        // Solo owners pueden gestionar permisos
        if ($request->user()->role !== 'owner') {
            abort(403, 'Solo los dueños pueden gestionar permisos.');
        }

        // Verificar que el usuario pertenece al establecimiento
        if (!$user->establishments()->where('establishments.id', $establishment->id)->exists()) {
            abort(404, 'El usuario no pertenece a este establecimiento.');
        }

        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        // Eliminar permisos anteriores para este establecimiento
        $user->permissions()
            ->wherePivot('establishment_id', $establishment->id)
            ->detach();

        // Asignar nuevos permisos
        $permissionsData = [];
        foreach ($validated['permissions'] as $permissionId) {
            $permissionsData[$permissionId] = [
                'establishment_id' => $establishment->id,
                'granted' => true,
                'granted_by' => $request->user()->id,
            ];
        }

        $user->permissions()->attach($permissionsData);

        return redirect()
            ->route('business.staff.index')
            ->with('success', 'Permisos actualizados correctamente.');
    }
}
