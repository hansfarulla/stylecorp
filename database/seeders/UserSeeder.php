<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Tenant;
use App\Models\Establishment;
use App\Models\Workstation;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear tenant
        $tenant = Tenant::create([
            'id' => 'tenant-demo',
            'data' => json_encode(['name' => 'Demo Company']),
        ]);

        // Usuario propietario de negocio
        $owner = User::create([
            'name' => 'Carlos Propietario',
            'email' => 'owner@demo.com',
            'password' => Hash::make('password'),
            'type' => 'establishment',
            'role' => 'owner',
            'status' => 'active',
            'email_verified_at' => now(),
            'tenant_id' => $tenant->id,
        ]);

        // Managers
        $manager1 = User::create([
            'name' => 'Ana Manager',
            'email' => 'manager@demo.com',
            'password' => Hash::make('password'),
            'type' => 'establishment',
            'role' => 'manager',
            'status' => 'active',
            'email_verified_at' => now(),
            'tenant_id' => $tenant->id,
        ]);

        // Personal (Staff)
        $staff1 = User::create([
            'name' => 'Pedro Estilista',
            'email' => 'pedro@demo.com',
            'password' => Hash::make('password'),
            'type' => 'establishment',
            'role' => 'staff',
            'status' => 'active',
            'email_verified_at' => now(),
            'tenant_id' => $tenant->id,
            'phone' => '+506 8888-1111',
        ]);

        $staff2 = User::create([
            'name' => 'Carlos Barbero',
            'email' => 'carlos@demo.com',
            'password' => Hash::make('password'),
            'type' => 'establishment',
            'role' => 'staff',
            'status' => 'active',
            'email_verified_at' => now(),
            'tenant_id' => $tenant->id,
            'phone' => '+506 8888-2222',
        ]);

        $staff3 = User::create([
            'name' => 'Juan Manicurista',
            'email' => 'juan@demo.com',
            'password' => Hash::make('password'),
            'type' => 'establishment',
            'role' => 'staff',
            'status' => 'active',
            'email_verified_at' => now(),
            'tenant_id' => $tenant->id,
            'phone' => '+506 8888-3333',
        ]);

        // Crear establecimiento
        $establishment = Establishment::create([
            'owner_id' => $owner->id,
            'tenant_id' => $tenant->id,
            'manager_id' => $manager1->id,
            'name' => 'Style Corp Centro',
            'business_name' => 'Style Corp S.A.',
            'slug' => 'style-corp-centro',
            'type' => 'salon',
            'address' => 'Avenida Central, Calle 5',
            'province' => 'San José',
            'canton' => 'San José',
            'district' => 'Carmen',
            'latitude' => 9.9337,
            'longitude' => -84.0836,
            'phone' => '+506 2222-3333',
            'email' => 'info@stylecorp.com',
            'whatsapp' => '+506 8888-0000',
            'website' => 'https://stylecorp.com',
            'business_hours' => json_encode([
                'monday' => ['09:00', '18:00'],
                'tuesday' => ['09:00', '18:00'],
                'wednesday' => ['09:00', '18:00'],
                'thursday' => ['09:00', '18:00'],
                'friday' => ['09:00', '20:00'],
                'saturday' => ['08:00', '17:00'],
                'sunday' => null,
            ]),
            'accepts_walk_ins' => true,
            'offers_home_service' => false,
            'min_booking_hours' => 2,
            'cancellation_hours' => 24,
            'status' => 'active',
        ]);

        // Establecer como establecimiento activo
        $owner->update(['active_establishment_id' => $establishment->id]);
        $manager1->update(['active_establishment_id' => $establishment->id]);

        // Vincular staff al establecimiento
        $establishment->users()->attach($staff1->id, ['role' => 'staff']);
        $establishment->users()->attach($staff2->id, ['role' => 'staff']);
        $establishment->users()->attach($staff3->id, ['role' => 'staff']);
        $establishment->users()->attach($manager1->id, ['role' => 'manager']);

        // Crear estaciones de trabajo
        $workstation1 = Workstation::create([
            'establishment_id' => $establishment->id,
            'name' => 'Estación 1',
            'number' => '1',
            'description' => 'Estación principal con espejo grande',
            'status' => 'available',
        ]);

        $workstation2 = Workstation::create([
            'establishment_id' => $establishment->id,
            'name' => 'Estación 2',
            'number' => '2',
            'description' => 'Estación con luz natural',
            'status' => 'available',
        ]);

        $workstation3 = Workstation::create([
            'establishment_id' => $establishment->id,
            'name' => 'Estación 3',
            'number' => '3',
            'description' => 'Estación para servicios especiales',
            'status' => 'available',
        ]);

        // Asignar personal a estaciones con horarios
        // Pedro: Turno matutino (6 AM - 12 PM)
        $workstation1->assignedUsers()->attach($staff1->id, [
            'start_time' => '06:00',
            'end_time' => '12:00',
            'notes' => 'Turno matutino',
        ]);

        // Carlos: Turno vespertino (12 PM - 6 PM)
        $workstation1->assignedUsers()->attach($staff2->id, [
            'start_time' => '12:00',
            'end_time' => '18:00',
            'notes' => 'Turno vespertino',
        ]);

        // Juan: Sin horario específico (todo el día)
        $workstation2->assignedUsers()->attach($staff3->id, [
            'notes' => 'Disponible todo el día',
        ]);

        // Crear segundo establecimiento
        $establishment2 = Establishment::create([
            'owner_id' => $owner->id,
            'tenant_id' => $tenant->id,
            'name' => 'Style Corp Norte',
            'business_name' => 'Style Corp S.A.',
            'slug' => 'style-corp-norte',
            'type' => 'barbershop',
            'address' => 'Plaza Real, Local 45',
            'province' => 'Heredia',
            'canton' => 'Heredia',
            'district' => 'Mercedes',
            'latitude' => 9.9989,
            'longitude' => -84.1169,
            'phone' => '+506 2222-4444',
            'email' => 'norte@stylecorp.com',
            'business_hours' => json_encode([
                'monday' => ['10:00', '19:00'],
                'tuesday' => ['10:00', '19:00'],
                'wednesday' => ['10:00', '19:00'],
                'thursday' => ['10:00', '19:00'],
                'friday' => ['10:00', '21:00'],
                'saturday' => ['09:00', '18:00'],
                'sunday' => null,
            ]),
            'accepts_walk_ins' => true,
            'offers_home_service' => false,
            'min_booking_hours' => 1,
            'cancellation_hours' => 12,
            'status' => 'active',
        ]);

        // Usuario cliente
        User::create([
            'name' => 'María Cliente',
            'email' => 'cliente@demo.com',
            'password' => Hash::make('password'),
            'type' => 'client',
            'role' => 'customer',
            'status' => 'active',
            'email_verified_at' => now(),
            'phone' => '+506 7777-1111',
        ]);

        // Usuario profesional freelance
        User::create([
            'name' => 'Laura Freelance',
            'email' => 'freelance@demo.com',
            'password' => Hash::make('password'),
            'type' => 'professional',
            'role' => 'freelancer',
            'status' => 'active',
            'email_verified_at' => now(),
            'phone' => '+506 6666-1111',
        ]);

        $this->command->info('✓ Usuarios, establecimientos y estaciones creados correctamente');
        $this->command->info('');
        $this->command->info('Credenciales de acceso:');
        $this->command->info('  Propietario: owner@demo.com / password');
        $this->command->info('  Manager: manager@demo.com / password');
        $this->command->info('  Staff (Pedro): pedro@demo.com / password');
        $this->command->info('  Staff (Carlos): carlos@demo.com / password');
        $this->command->info('  Staff (Juan): juan@demo.com / password');
        $this->command->info('  Cliente: cliente@demo.com / password');
        $this->command->info('  Freelance: freelance@demo.com / password');
    }
}
