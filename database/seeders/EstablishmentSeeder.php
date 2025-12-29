<?php

namespace Database\Seeders;

use App\Enums\CommissionModel;
use App\Enums\EmploymentType;
use App\Enums\EstablishmentStatus;
use App\Enums\EstablishmentType;
use App\Enums\PaymentFlow;
use App\Enums\ZoneType;
use App\Models\Establishment;
use App\Models\EstablishmentUser;
use App\Models\ProfessionalServiceZone;
use App\Models\User;
use Illuminate\Database\Seeder;

class EstablishmentSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = \App\Models\Tenant::where('id', 'stylecorp-demo')->first();
        $owner = User::where('email', 'carlos@elclasico.com')->first();
        $maria = User::where('email', 'maria.gonzalez@gmail.com')->first();
        $jose = User::where('email', 'jose.hernandez@gmail.com')->first();
        $luis = User::where('email', 'luis.martinez@gmail.com')->first();

        // === ESTABLECIMIENTO 1: Barbería El Clásico ===
        $elClasico = Establishment::create([
            'tenant_id' => $tenant->id,
            'owner_id' => $owner->id,
            'name' => 'Barbería El Clásico',
            'slug' => 'barberia-el-clasico',
            'business_name' => 'El Clásico Barbershop S.A.',
            'tax_id' => '3-101-654321',
            'type' => EstablishmentType::BARBERSHOP->value,
            'email' => 'info@elclasico.com',
            'phone' => '+506 2222-3333',
            'whatsapp' => '+506 8765-4321',
            'address' => 'Avenida Central, 100m norte del Parque Central',
            'province' => 'San José',
            'canton' => 'San José',
            'district' => 'Carmen',
            'latitude' => 9.9336,
            'longitude' => -84.0833,
            'business_hours' => json_encode([
                'monday' => ['09:00', '19:00'],
                'tuesday' => ['09:00', '19:00'],
                'wednesday' => ['09:00', '19:00'],
                'thursday' => ['09:00', '19:00'],
                'friday' => ['09:00', '20:00'],
                'saturday' => ['08:00', '18:00'],
                'sunday' => ['09:00', '15:00'],
            ]),
            'accepts_walk_ins' => true,
            'offers_home_service' => false,
            'min_booking_hours' => 2,
            'cancellation_policy' => 'Cancelaciones con menos de 24h tienen cargo del 50%',
            'cancellation_hours' => 24,
            'cancellation_fee' => 50.0,
            'no_show_fee' => 100.0,
            'payment_flow' => 'mixed',
            'payment_methods' => json_encode(['cash', 'card', 'sinpe']),
            'status' => EstablishmentStatus::ACTIVE->value,
            'is_verified' => true,
            'verified_at' => now(),
            'rating' => 4.8,
            'total_reviews' => 127,
            'total_bookings' => 1543,
        ]);
        echo "✅ Establecimiento: {$elClasico->name}\n";

        // María - Empleada (Salary + Commission)
        EstablishmentUser::create([
            'establishment_id' => $elClasico->id,
            'user_id' => $maria->id,
            'role' => 'staff',
            'employment_type' => EmploymentType::EMPLOYEE->value,
            'commission_model' => CommissionModel::SALARY_PLUS->value,
            'base_salary' => 300000, // ₡300,000
            'commission_percentage' => 25.00,
            'payment_period' => 'monthly',
            'status' => 'active',
            'start_date' => now()->subMonths(6),
        ]);
        echo "  └─ Empleada: María (Salario + 25%)\n";

        // José - Empleado (Percentage 60%)
        EstablishmentUser::create([
            'establishment_id' => $elClasico->id,
            'user_id' => $jose->id,
            'role' => 'staff',
            'employment_type' => EmploymentType::EMPLOYEE->value,
            'commission_model' => CommissionModel::PERCENTAGE->value,
            'commission_percentage' => 60.00,
            'payment_period' => 'weekly',
            'status' => 'active',
            'start_date' => now()->subMonths(3),
        ]);
        echo "  └─ Empleado: José (60% comisión)\n";

        // Luis - Freelancer colaborando (Booth Rental)
        EstablishmentUser::create([
            'establishment_id' => $elClasico->id,
            'user_id' => $luis->id,
            'role' => 'freelancer',
            'employment_type' => EmploymentType::FREELANCER->value,
            'commission_model' => CommissionModel::BOOTH_RENTAL->value,
            'booth_rental_fee' => 30000, // ₡30,000/mes
            'payment_period' => 'monthly',
            'status' => 'active',
            'start_date' => now()->subMonth(),
            'agreement_terms' => json_encode([
                'days' => ['Friday', 'Saturday'],
                'hours' => '10:00-18:00',
                'keeps_100_percent' => true,
            ]),
        ]);
        echo "  └─ Freelancer: Luis (Alquiler ₡30k/mes)\n";

        // === ESTABLECIMIENTO 2: Salón Elegancia ===
        $elegancia = Establishment::create([
            'tenant_id' => $tenant->id,
            'owner_id' => $owner->id,
            'name' => 'Salón Elegancia',
            'slug' => 'salon-elegancia',
            'type' => EstablishmentType::SALON->value,
            'email' => 'info@salonelegancia.com',
            'phone' => '+506 2233-4444',
            'whatsapp' => '+506 8777-5555',
            'address' => 'Escazú Centro Comercial, Local 45',
            'province' => 'San José',
            'canton' => 'Escazú',
            'district' => 'Escazú',
            'latitude' => 9.9195,
            'longitude' => -84.1371,
            'business_hours' => json_encode([
                'monday' => ['10:00', '19:00'],
                'tuesday' => ['10:00', '19:00'],
                'wednesday' => ['10:00', '19:00'],
                'thursday' => ['10:00', '19:00'],
                'friday' => ['10:00', '20:00'],
                'saturday' => ['09:00', '19:00'],
                'sunday' => null,
            ]),
            'accepts_walk_ins' => false,
            'offers_home_service' => true,
            'home_service_zones' => json_encode(['Escazú', 'Santa Ana', 'San Rafael']),
            'min_booking_hours' => 4,
            'payment_flow' => 'centralized',
            'payment_methods' => json_encode(['card', 'sinpe', 'transfer']),
            'status' => EstablishmentStatus::ACTIVE->value,
            'is_verified' => true,
            'verified_at' => now(),
            'rating' => 4.9,
            'total_reviews' => 89,
        ]);
        echo "✅ Establecimiento: {$elegancia->name}\n";

        // === ZONAS DE SERVICIO: Luis (Freelancer independiente) ===
        
        // Zona 1: Estudio en Curridabat
        ProfessionalServiceZone::create([
            'tenant_id' => $tenant->id,
            'professional_id' => $luis->id,
            'zone_type' => ZoneType::FIXED_LOCATION->value,
            'zone_name' => 'Estudio Luis - Curridabat',
            'address' => '150m este del Mall San Pedro',
            'province' => 'San José',
            'canton' => 'Curridabat',
            'district' => 'Curridabat',
            'latitude' => 9.9197,
            'longitude' => -84.0394,
            'available_online' => true,
            'available_walk_in' => true,
            'available_home_service' => false,
            'business_hours' => json_encode([
                'monday' => ['14:00', '20:00'],
                'tuesday' => ['14:00', '20:00'],
                'wednesday' => ['14:00', '20:00'],
                'thursday' => ['14:00', '20:00'],
                'sunday' => ['10:00', '18:00'],
            ]),
            'priority' => 1,
            'is_active' => true,
        ]);
        echo "  └─ Zona fija: Estudio Luis en Curridabat\n";

        // Zona 2: Servicio a domicilio GAM
        ProfessionalServiceZone::create([
            'tenant_id' => $tenant->id,
            'professional_id' => $luis->id,
            'zone_type' => ZoneType::SERVICE_AREA->value,
            'zone_name' => 'Servicio a domicilio - GAM',
            'coverage_areas' => json_encode(['San José', 'Heredia', 'Alajuela', 'Cartago']),
            'coverage_radius_km' => 25.0,
            'available_online' => true,
            'available_walk_in' => false,
            'available_home_service' => true,
            'priority' => 2,
            'is_active' => true,
        ]);
        echo "  └─ Zona móvil: GAM (radio 25km)\n";

        echo "\n🎉 Seeders de Establecimientos completados!\n";
    }
}
