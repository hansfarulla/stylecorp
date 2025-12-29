<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Establishment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class StyleCorpCentroSeeder extends Seeder
{
    public function run(): void
    {
        // Buscar el establecimiento del usuario actual (owner@demo.com)
        $establishment = Establishment::where('slug', 'style-corp-centro')->first();
        
        if (!$establishment) {
            echo "No se encontró el establecimiento 'Style Corp Centro'.\n";
            return;
        }

        $tenant_id = $establishment->tenant_id;

        // Buscar personal
        $pedro = User::where('email', 'pedro@demo.com')->first();
        $carlos = User::where('email', 'carlos@demo.com')->first();
        $juan = User::where('email', 'juan@demo.com')->first();
        
        // Buscar clientes
        $ana = User::where('email', 'ana.rodriguez@gmail.com')->first();
        $diego = User::where('email', 'diego.vargas@gmail.com')->first();

        // 1. Crear Servicios para este establecimiento
        $services = [];
        
        $services[] = Service::create([
            'tenant_id' => $tenant_id,
            'establishment_id' => $establishment->id,
            'professional_id' => $pedro->id,
            'name' => 'Corte de Cabello',
            'slug' => 'corte-cabello-pedro',
            'description' => 'Corte de cabello para caballero',
            'category' => 'cut',
            'duration_minutes' => 45,
            'base_price' => 10000,
            'available_online' => true,
            'is_active' => true,
        ]);

        $services[] = Service::create([
            'tenant_id' => $tenant_id,
            'establishment_id' => $establishment->id,
            'professional_id' => $carlos->id,
            'name' => 'Afeitado Clásico',
            'slug' => 'afeitado-clasico-carlos',
            'description' => 'Afeitado con toalla caliente',
            'category' => 'beard',
            'duration_minutes' => 30,
            'base_price' => 8000,
            'available_online' => true,
            'is_active' => true,
        ]);

        $services[] = Service::create([
            'tenant_id' => $tenant_id,
            'establishment_id' => $establishment->id,
            'professional_id' => $juan->id,
            'name' => 'Manicure Express',
            'slug' => 'manicure-express-juan',
            'description' => 'Limpieza y corte de uñas',
            'category' => 'nails',
            'duration_minutes' => 40,
            'base_price' => 12000,
            'available_online' => true,
            'is_active' => true,
        ]);

        echo "✅ Servicios creados para Style Corp Centro\n";

        // 2. Crear Citas
        $appointments = [
            // Hoy
            [
                'professional' => $pedro,
                'customer' => $diego,
                'service' => $services[0], // Corte
                'start' => now()->setTime(10, 0),
                'status' => AppointmentStatus::CONFIRMED,
            ],
            [
                'professional' => $carlos,
                'customer' => $diego,
                'service' => $services[1], // Afeitado
                'start' => now()->setTime(11, 0),
                'status' => AppointmentStatus::PENDING,
            ],
            [
                'professional' => $juan,
                'customer' => $ana,
                'service' => $services[2], // Manicure
                'start' => now()->setTime(14, 30),
                'status' => AppointmentStatus::CONFIRMED,
            ],
            
            // Mañana
            [
                'professional' => $pedro,
                'customer' => $ana,
                'service' => $services[0], // Corte
                'start' => now()->addDay()->setTime(9, 0),
                'status' => AppointmentStatus::CONFIRMED,
            ],
            [
                'professional' => $juan,
                'customer' => $diego,
                'service' => $services[2], // Manicure
                'start' => now()->addDay()->setTime(16, 0),
                'status' => AppointmentStatus::PENDING,
            ],
        ];

        foreach ($appointments as $apt) {
            Appointment::create([
                'tenant_id' => $tenant_id,
                'establishment_id' => $establishment->id,
                'customer_id' => $apt['customer']->id,
                'professional_id' => $apt['professional']->id,
                'service_id' => $apt['service']->id,
                'booking_code' => 'APT-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'scheduled_at' => $apt['start'],
                'scheduled_end_at' => $apt['start']->copy()->addMinutes($apt['service']->duration_minutes),
                'duration_minutes' => $apt['service']->duration_minutes,
                'service_price' => $apt['service']->base_price,
                'subtotal' => $apt['service']->base_price,
                'discount' => 0,
                'total' => $apt['service']->base_price,
                'location_type' => 'in_store',
                'status' => $apt['status']->value,
                'customer_notes' => 'Cita de prueba Style Corp',
            ]);
        }

        echo "✅ Se han agregado " . count($appointments) . " citas para Style Corp Centro.\n";
    }
}
