<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirigir al proveedor OAuth
     */
    public function redirect(string $provider)
    {
        $this->validateProvider($provider);

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Manejar el callback del proveedor OAuth
     */
    public function callback(string $provider)
    {
        $this->validateProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Error al autenticar con ' . ucfirst($provider));
        }

        // Buscar usuario por provider_id o email
        $user = $this->findOrCreateUser($socialUser, $provider);

        // Autenticar usuario
        Auth::login($user, true);

        // Actualizar último login
        $user->updateLastLogin();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Buscar o crear usuario desde datos de OAuth
     */
    protected function findOrCreateUser($socialUser, string $provider): User
    {
        $providerField = $provider . '_id';

        // Buscar por provider_id
        $user = User::where($providerField, $socialUser->getId())->first();

        if ($user) {
            return $user;
        }

        // Buscar por email (vincular cuenta existente)
        $user = User::where('email', $socialUser->getEmail())->first();

        if ($user) {
            // Vincular cuenta existente con provider
            $user->update([
                $providerField => $socialUser->getId(),
                'avatar' => $user->avatar ?? $this->getAvatarFromSocial($socialUser),
            ]);

            return $user;
        }

        // Crear nuevo usuario
        return User::create([
            'tenant_id' => tenancy()->tenant?->id,
            'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Usuario',
            'email' => $socialUser->getEmail(),
            'email_verified_at' => now(), // OAuth verifica el email
            $providerField => $socialUser->getId(),
            'avatar' => $this->getAvatarFromSocial($socialUser),
            'password' => Hash::make(Str::random(32)), // Password aleatorio
            'role' => 'customer',
            'type' => 'client',
            'status' => 'active',
            'locale' => 'es',
            'timezone' => 'America/Costa_Rica',
        ]);
    }

    /**
     * Obtener avatar desde proveedor social
     */
    protected function getAvatarFromSocial($socialUser): ?string
    {
        return $socialUser->getAvatar();
    }

    /**
     * Validar que el proveedor sea soportado
     */
    protected function validateProvider(string $provider): void
    {
        if (!in_array($provider, ['google', 'facebook'])) {
            abort(404);
        }
    }
}
