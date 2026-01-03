<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $establishmentId = $request->user()->active_establishment_id;
        
        // Ensure default roles exist
        $defaultRoles = ['Administrador', 'User'];
        foreach ($defaultRoles as $roleName) {
            Role::firstOrCreate([
                'name' => $roleName,
                'establishment_id' => $establishmentId,
                'guard_name' => 'web'
            ]);
        }
        
        $roles = Role::where('establishment_id', $establishmentId)
            ->with('permissions')
            ->get();

        return Inertia::render('business/roles/index', [
            'roles' => $roles
        ]);
    }

    public function create()
    {
        $permissions = Permission::all();

        return Inertia::render('business/roles/create', [
            'permissions' => $permissions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'array'
        ]);

        $establishmentId = $request->user()->active_establishment_id;

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web',
            'establishment_id' => $establishmentId
        ]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('business.roles.index')->with('success', 'Rol creado exitosamente.');
    }

    public function edit(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        
        // Check if role belongs to establishment
        if ($role->establishment_id != $request->user()->active_establishment_id) {
            abort(403);
        }

        $permissions = Permission::all();
        $role->load('permissions');

        return Inertia::render('business/roles/edit', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $role->permissions->pluck('name')
        ]);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        if ($role->establishment_id != $request->user()->active_establishment_id) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'array'
        ]);

        // Prevent renaming protected roles
        $protectedRoles = ['Administrador', 'User'];
        if (in_array($role->name, $protectedRoles) && $role->name !== $request->name) {
            return back()->with('error', 'No se puede cambiar el nombre de los roles predeterminados.');
        }

        $role->update(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('business.roles.index')->with('success', 'Rol actualizado exitosamente.');
    }

    public function destroy(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        
        if ($role->establishment_id != $request->user()->active_establishment_id) {
            abort(403);
        }

        // Prevent deleting protected roles
        $protectedRoles = ['Administrador', 'User'];
        if (in_array($role->name, $protectedRoles)) {
            return back()->with('error', 'No se pueden eliminar los roles predeterminados.');
        }

        $role->delete();

        return redirect()->route('business.roles.index')->with('success', 'Rol eliminado exitosamente.');
    }
}
