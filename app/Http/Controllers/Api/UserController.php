<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Filtros
        if ($request->has('role')) {
            $query->byRole($request->role);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('username', 'like', "%{$request->search}%");
            });
        }

        // Profesionales
        if ($request->boolean('professionals')) {
            $query->professionals();
        }

        $users = $query->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'unique:users', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', Password::defaults()],
            'role' => ['required', 'in:owner,manager,staff,freelancer,customer'],
            'bio' => ['nullable', 'string'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:50'],
            'specialties' => ['nullable', 'array'],
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['tenant_id'] = tenancy()->tenant?->id;
        $validated['type'] = match($validated['role']) {
            'owner', 'manager' => 'establishment',
            'staff', 'freelancer' => 'professional',
            default => 'client'
        };

        $user = User::create($validated);

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $user
        ], 201);
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        return response()->json($user);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'username' => ['sometimes', 'string', 'unique:users,username,' . $user->id, 'max:255'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $user->id, 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'avatar' => ['nullable', 'string'],
            'role' => ['sometimes', 'in:owner,manager,staff,freelancer,customer'],
            'bio' => ['nullable', 'string'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:50'],
            'specialties' => ['nullable', 'array'],
            'certifications' => ['nullable', 'array'],
            'status' => ['sometimes', 'in:active,inactive,suspended,pending'],
            'notifications_enabled' => ['boolean'],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }

    /**
     * Get professionals (staff and freelancers)
     */
    public function professionals(Request $request)
    {
        $professionals = User::professionals()
            ->active()
            ->with(['specialties'])
            ->get();

        return response()->json($professionals);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'username' => ['sometimes', 'string', 'unique:users,username,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string'],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'locale' => ['sometimes', 'string', 'in:es,en'],
            'timezone' => ['sometimes', 'string'],
            'notifications_enabled' => ['boolean'],
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Perfil actualizado exitosamente',
            'user' => $user
        ]);
    }
}
