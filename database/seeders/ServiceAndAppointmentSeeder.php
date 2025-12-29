<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Enums\PaymentMethod;
use App\Models\Appointment;
use App\Models\Establishment;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class ServiceAndAppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = \App\Models\Tenant::where('id', 'stylecorp-demo')->first();
        $elClasico = Establishment::where('slug', 'barberia-el-clasico')->first();
        $elegancia = Establishment::where('slug', 'salon-elegancia')->first();
        
        $maria = User::where('email', 'maria.gonzalez@gmail.com')->first();
        $jose = User::where('email', 'jose.hernandez@gmail.com')->first();
        $luis = User::where('email', 'luis.martinez@gmail.com')->first();
        
        $ana = User::where('email', 'ana.rodriguez@gmail.com')->first();
        $diego = User::where('email', 'diego.vargas@gmail.com')->first();

        // === SERVICIOS DE BARBERÍA EL CLÁSICO ===
        $services = [
            [
                'tenant_id' => $tenant->id,
                'establishment_id' => $elClasico->id,
                'professional_id' => $jose->id,
                'name' => 'Corte Clásico',
                'slug' => 'corte-clasico-jose',
                'description' => 'Corte tradicional con tijera y máquina',
                'category' => 'cut',
                'duration_minutes' => 30,
                'base_price' => 8000,
                'available_online' => true,
                'available_home_service' => false,
                'is_active' => true,
            ],
            [
                'tenant_id' => $tenant->id,
                'establishment_id' => $elClasico->id,
                'professional_id' => $jose->id,
                'name' => 'Corte + Barba',
                'slug' => 'corte-barba-jose',
                'description' => 'Corte de cabello + arreglo de barba con navaja',
                'category' => 'cut',
                'duration_minutes' => 45,
                'base_price' => 12000,
                'available_online' => true,
                'available_home_service' => false,
                'is_active' => true,
            ],
            [
                'tenant_id' => $tenant->id,
                'establishment_id' => $elClasico->id,
                'professional_id' => $maria->id,
                'name' => 'Fade Moderno',
                'slug' => 'fade-moderno-maria',
                'description' => 'Fade degradado con diseño personalizado',
                'category' => 'cut',
                'duration_minutes' => 60,
                'base_price' => 15000,
                'available_online' => true,
                'available_home_service' => false,
                'is_active' => true,
            ],
        ];

        foreach ($services as $serviceData) {
            Service::create($serviceData);
        }
        echo "✅ {$elClasico->name}: 3 servicios creados\n";

        // === SERVICIOS DE LUIS (INDEPENDIENTE) ===
        $luisServices = [
            [
                'tenant_id' => $tenant->id,
                'establishment_id' => null, // Servicio independiente
                'professional_id' => $luis->id,
                'name' => 'Corte Fade Premium',
                'slug' => 'fade-premium-luis',
                'description' => 'Fade de alta precisión con diseño incluido',
                'category' => 'cut',
                'duration_minutes' => 75,
                'base_price' => 18000,
                'available_online' => true,
                'available_home_service' => true,
                'home_service_surcharge' => 5000, // +₡5,000 a domicilio
                'independent_address' => '150m este del Mall San Pedro',
                'independent_province' => 'San José',
                'independent_canton' => 'Curridabat',
                'independent_district' => 'Curridabat',
                'independent_latitude' => 9.9197,
                'independent_longitude' => -84.0394,
                'is_active' => true,
            ],
            [
                'tenant_id' => $tenant->id,
                'establishment_id' => null,
                'professional_id' => $luis->id,
                'name' => 'Diseño de Barba',
                'slug' => 'diseno-barba-luis',
                'description' => 'Diseño profesional y mantenimiento de barba',
                'category' => 'beard',
                'duration_minutes' => 30,
                'base_price' => 10000,
                'available_online' => true,
                'available_home_service' => true,
                'home_service_surcharge' => 3000,
                'is_active' => true,
            ],
        ];

        foreach ($luisServices as $serviceData) {
            Service::create($serviceData);
        }
        echo "✅ Luis (Independiente): 2 servicios creados\n";

        // === CITAS ===
        
        // Cita completada: Diego con José en El Clásico (hace 5 días)
        $serviceCorte = Service::where('name', 'Corte Clásico')->first();
        $appointment1 = Appointment::create([
            'tenant_id' => $tenant->id,
            'establishment_id' => $elClasico->id,
            'customer_id' => $diego->id,
            'professional_id' => $jose->id,
            'service_id' => $serviceCorte->id,
            'booking_code' => 'APT-' . strtoupper(substr(md5(time()), 0, 8)),
            'scheduled_at' => now()->subDays(5)->setTime(10, 0),
            'scheduled_end_at' => now()->subDays(5)->setTime(10, 30),
            'duration_minutes' => 30,
            'service_price' => 8000,
            'subtotal' => 8000,
            'discount' => 0,
            'total' => 8000,
            'location_type' => 'in_store',
            'status' => AppointmentStatus::COMPLETED->value,
            'confirmed_at' => now()->subDays(6),
            'started_at' => now()->subDays(5)->setTime(10, 0),
            'completed_at' => now()->subDays(5)->setTime(10, 30),
        ]);

        // Transacción de la cita
        Transaction::create([
            'tenant_id' => $tenant->id,
            'establishment_id' => $elClasico->id,
            'appointment_id' => $appointment1->id,
            'customer_id' => $diego->id,
            'professional_id' => $jose->id,
            'transaction_code' => 'TXN-' . strtoupper(substr(md5(time() + 1), 0, 10)),
            'type' => 'payment',
            'subtotal' => 8000,
            'discount' => 0,
            'tip' => 0,
            'tax' => 0,
            'total' => 8000,
            'payment_method' => PaymentMethod::CASH->value,
            'status' => 'completed',
            'paid_at' => now()->subDays(5)->setTime(10, 30),
            'professional_commission' => 4800, // 60% para José
            'platform_fee' => 0,
            'establishment_net' => 3200, // 40% para El Clásico
        ]);
        echo "  └─ Cita completada: Diego → José (Corte, ₡8,000)\n";

        // Cita confirmada: Ana con Luis (independiente, a domicilio, mañana)
        $serviceFade = Service::where('name', 'Corte Fade Premium')
            ->where('professional_id', $luis->id)
            ->first();
            
        Appointment::create([
            'tenant_id' => $tenant->id,
            'establishment_id' => null, // Sin establecimiento
            'customer_id' => $ana->id,
            'professional_id' => $luis->id,
            'service_id' => $serviceFade->id,
            'booking_code' => 'APT-' . strtoupper(substr(md5(time() + 2), 0, 8)),
            'scheduled_at' => now()->addDay()->setTime(15, 0),
            'scheduled_end_at' => now()->addDay()->setTime(16, 15), // +75 min
            'duration_minutes' => 75,
            'service_price' => 18000,
            'home_service_surcharge' => 5000, // +₡5,000 domicilio
            'subtotal' => 23000,
            'discount' => 0,
            'total' => 23000,
            'location_type' => 'home_service',
            'home_address' => 'Escazú, Residencial Los Laureles, Casa 42',
            'home_latitude' => 9.9195,
            'home_longitude' => -84.1371,
            'status' => AppointmentStatus::CONFIRMED->value,
            'confirmed_at' => now(),
            'customer_notes' => 'Cliente prefiere estilo moderno, referencias en Instagram',
        ]);
        echo "  └─ Cita confirmada: Ana → Luis (Fade a domicilio, ₡23,000) [MAÑANA]\n";

        // Cita pendiente: Diego con María en El Clásico (en 3 días)
        $serviceFadeClasico = Service::where('name', 'Fade Moderno')
            ->where('establishment_id', $elClasico->id)
            ->first();
            
        Appointment::create([
            'tenant_id' => $tenant->id,
            'establishment_id' => $elClasico->id,
            'customer_id' => $diego->id,
            'professional_id' => $maria->id,
            'service_id' => $serviceFadeClasico->id,
            'booking_code' => 'APT-' . strtoupper(substr(md5(time() + 3), 0, 8)),
            'scheduled_at' => now()->addDays(3)->setTime(16, 0),
            'scheduled_end_at' => now()->addDays(3)->setTime(17, 0), // +60 min
            'duration_minutes' => 60,
            'service_price' => 15000,
            'subtotal' => 15000,
            'discount' => 0,
            'total' => 15000,
            'location_type' => 'in_store',
            'status' => AppointmentStatus::PENDING->value,
            'customer_notes' => 'Primera vez, quiere algo moderno',
        ]);
        echo "  └─ Cita pendiente: Diego → María (Fade, ₡15,000) [EN 3 DÍAS]\n";

        echo "\n🎉 Seeders de Servicios y Citas completados!\n";
    }
}
