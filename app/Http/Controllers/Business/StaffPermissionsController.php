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
     * Mostrar listado de staff para gestionar permisos
     */
    public function index(Request $request)
    {
        $establishment = Establishment::findOrFail($request->user()->active_establishment_id);

        // Solo owners pueden gestionar permisos
        if ($request->user()->role !== 'owner' && $request->user()->role !== 'super_admin') {
            abort(403, 'Solo los dueños pueden gestionar permisos.');
        }

        // Obtener staff del establecimiento (excluyendo owners y super_admins)
        $staff = $establishment->users()
            ->whereNotIn('users.role', ['owner', 'super_admin'])
            ->with(['permissions' => function ($query) use ($establishment) {
                $query->where('permission_user.establishment_id', $establishment->id)
                      ->where('permission_user.granted', true);
            }])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'permissions_count' => $user->permissions->count(),
                ];
            });

        return Inertia::render('business/staff/permissions/index', [
            'staff' => $staff,
            'establishment' => $establishment,
        ]);
    }

    /**
     * Mostrar formulario de permisos granulares para un empleado
     */
    public function edit(Request $request, User $staff)
    {
        $establishment = Establishment::findOrFail($request->user()->active_establishment_id);

        // Solo owners pueden gestionar permisos
        if ($request->user()->role !== 'owner') {
            abort(403, 'Solo los dueños pueden gestionar permisos.');
        }

        // Verificar que el usuario pertenece al establecimiento
        if (!$staff->establishments()->where('establishments.id', $establishment->id)->exists()) {
            abort(404, 'El usuario no pertenece a este establecimiento.');
        }

        // No se pueden modificar permisos de owners ni super_admins
        if (in_array($staff->role, ['owner', 'super_admin'])) {
            abort(403, 'No se pueden modificar permisos de dueños o super administradores.');
        }

        $permissions = Permission::orderBy('category')->orderBy('order')->get()->groupBy('category');
        
        // Obtener permisos actuales del usuario
        $userPermissions = $staff->permissions()
            ->where('permission_user.establishment_id', $establishment->id)
            ->where('permission_user.granted', true)
            ->pluck('permissions.id')
            ->toArray();

        // Permisos del rol por defecto
        $rolePermissions = \App\Enums\UserRole::from($staff->role)->permissions();

        return Inertia::render('business/staff/permissions/edit', [
            'staff' => $staff->load('establishments'),
            'permissions' => $permissions,
            'userPermissions' => $userPermissions,
            'rolePermissions' => $rolePermissions,
            'establishment' => $establishment,
        ]);
    }

    /**
     * Actualizar permisos granulares de un empleado
     */
    public function update(Request $request, User $staff)
    {
        $establishment = Establishment::findOrFail($request->user()->active_establishment_id);

        // Solo owners pueden gestionar permisos
        if ($request->user()->role !== 'owner') {
            abort(403, 'Solo los dueños pueden gestionar permisos.');
        }

        // Verificar que el usuario pertenece al establecimiento
        if (!$staff->establishments()->where('establishments.id', $establishment->id)->exists()) {
            abort(404, 'El usuario no pertenece a este establecimiento.');
        }

        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        // Eliminar permisos anteriores para este establecimiento
        $staff->permissions()
            ->wherePivot('establishment_id', $establishment->id)
            ->detach();

        // Asignar nuevos permisos
        foreach ($validated['permissions'] as $permissionId) {
            $staff->permissions()->attach($permissionId, [
                'granted' => true,
                'granted_by' => $request->user()->id,
                'establishment_id' => $establishment->id,
            ]);
        }

        return redirect()
            ->route('business.staff.permissions.edit', $staff)
            ->with('success', 'Permisos actualizados exitosamente.');
    }
}
