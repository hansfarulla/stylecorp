<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255', 'unique:users,username'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class)->where(function ($query) use ($input) {
                    return $query->where('tenant_id', tenancy()->tenant?->id);
                }),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => $this->passwordRules(),
            'role' => ['nullable', 'in:customer,staff,freelancer,owner'],
            'register_as' => ['nullable', 'in:client,professional,establishment'],
        ])->validate();

        // Determinar rol y tipo según el tipo de registro
        $registerAs = $input['register_as'] ?? 'client';
        $role = $input['role'] ?? match($registerAs) {
            'establishment' => 'owner',
            'professional' => 'freelancer',
            default => 'customer'
        };

        $type = match($role) {
            'owner', 'manager' => 'establishment',
            'staff', 'freelancer' => 'professional',
            default => 'client'
        };

        return User::create([
            'tenant_id' => tenancy()->tenant?->id,
            'name' => $input['name'],
            'username' => $input['username'] ?? null,
            'email' => $input['email'],
            'phone' => $input['phone'] ?? null,
            'password' => $input['password'],
            'role' => $role,
            'type' => $type,
            'status' => 'pending', // Requiere verificación de email
            'locale' => $input['locale'] ?? 'es',
            'timezone' => $input['timezone'] ?? 'America/Costa_Rica',
        ]);
    }
}
