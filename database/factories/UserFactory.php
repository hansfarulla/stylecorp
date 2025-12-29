<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    protected static ?string $password = null;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'avatar' => null,
            'role' => 'customer',
            'type' => 'client',
            'bio' => fake()->paragraph(),
            'locale' => 'es',
            'timezone' => 'America/Costa_Rica',
            'notifications_enabled' => true,
            'status' => 'active',
            'remember_token' => Str::random(10),
        ];
    }

    public function owner(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'owner',
            'type' => 'establishment',
        ]);
    }

    public function manager(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'manager',
            'type' => 'establishment',
        ]);
    }

    public function staff(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'staff',
            'type' => 'professional',
            'years_experience' => fake()->numberBetween(1, 15),
            'specialties' => ['cortes', 'barba', 'tinte'],
            'is_verified' => true,
        ]);
    }

    public function freelancer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'freelancer',
            'type' => 'professional',
            'years_experience' => fake()->numberBetween(1, 20),
            'specialties' => ['cortes modernos', 'fade', 'diseño'],
            'is_verified' => true,
        ]);
    }

    public function customer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'customer',
            'type' => 'client',
            'bio' => null,
            'years_experience' => null,
        ]);
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
            'phone_verified_at' => null,
        ]);
    }

    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'suspended',
        ]);
    }
}
