<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Enums\UserType;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
        // Tenant principal para desarrollo
        $tenant = Tenant::create([
            'id' => 'stylecorp-demo',
            'data' => json_encode([
                'name' => 'StyleCorp Demo',
                'email' => 'demo@stylecorp.com',
                'phone' => '+506 8888-8888',
                'subscription_plan' => 'premium',
                'subscription_status' => 'active',
                'trial_ends_at' => now()->addDays(30)->toDateTimeString(),
                'subscription_ends_at' => now()->addYear()->toDateTimeString(),
                'country' => 'Costa Rica',
                'currency' => 'CRC',
                'timezone' => 'America/Costa_Rica',
            ]),
        ]);

        echo "✅ Tenant creado: stylecorp-demo\n";

        // Usuarios del sistema (sin tenant - globals)
        $users = [
            [
                'tenant_id' => null, // Usuario global (puede acceder a múltiples tenants)
                'name' => 'Admin StyleCorp',
                'username' => 'admin',
                'email' => 'admin@stylecorp.com',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'type' => 'platform',
                'status' => 'active',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Carlos Rodríguez',
                'username' => 'carlos.owner',
                'email' => 'carlos@elclasico.com',
                'password' => Hash::make('password'),
                'phone' => '+506 8765-4321',
                'role' => 'owner',
                'type' => 'establishment',
                'bio' => 'Dueño de Barbería El Clásico. 15 años en el negocio.',
                'status' => 'active',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Luis Martínez',
                'username' => 'luis.barber',
                'email' => 'luis.martinez@gmail.com',
                'password' => Hash::make('password'),
                'phone' => '+506 8712-3456',
                'role' => 'freelancer',
                'type' => 'professional',
                'bio' => 'Barbero independiente especializado en fades y diseños.',
                'years_experience' => 8,
                'specialties' => json_encode(['Fades', 'Diseños', 'Barba']),
                'status' => 'active',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
            [
                'tenant_id' => $tenant->id,
                'name' => 'María González',
                'username' => 'maria.stylist',
                'email' => 'maria.gonzalez@gmail.com',
                'password' => Hash::make('password'),
                'phone' => '+506 8723-4567',
                'role' => 'staff',
                'type' => 'professional',
                'bio' => 'Estilista profesional con especialidad en color y tratamientos.',
                'years_experience' => 12,
                'specialties' => json_encode(['Coloración', 'Tratamientos', 'Corte de Dama']),
                'status' => 'active',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
            [
                'tenant_id' => $tenant->id,
                'name' => 'José Hernández',
                'username' => 'jose.barber',
                'email' => 'jose.hernandez@gmail.com',
                'password' => Hash::make('password'),
                'phone' => '+506 8734-5678',
                'role' => 'staff',
                'type' => 'professional',
                'bio' => 'Barbero clásico, especialista en cortes tradicionales.',
                'years_experience' => 5,
                'specialties' => json_encode(['Corte Clásico', 'Navaja', 'Afeitado']),
                'status' => 'active',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Ana Rodríguez',
                'username' => 'ana.client',
                'email' => 'ana.rodriguez@gmail.com',
                'password' => Hash::make('password'),
                'phone' => '+506 8745-6789',
                'role' => 'customer',
                'type' => 'client',
                'status' => 'active',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Diego Vargas',
                'username' => 'diego.client',
                'email' => 'diego.vargas@gmail.com',
                'password' => Hash::make('password'),
                'phone' => '+506 8756-7890',
                'role' => 'customer',
                'type' => 'client',
                'status' => 'active',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            $user = User::create($userData);
            echo "✅ Usuario creado: {$user->name} ({$user->role})\n";
        }

        echo "\n🎉 Seeders de Tenant y Usuarios completados!\n";
    }
}
