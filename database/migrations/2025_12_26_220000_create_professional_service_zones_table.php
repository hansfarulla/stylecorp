<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabla para que profesionales independientes definan las zonas geográficas
     * donde ofrecen sus servicios (sin necesidad de tener un establecimiento).
     * 
     * Ejemplos:
     * - "Opero en San José centro y Escazú"
     * - "Servicio a domicilio en toda la GAM"
     * - "Tengo un estudio en Curridabat (dirección exacta)"
     */
    public function up(): void
    {
        Schema::create('professional_service_zones', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            
            // Profesional que ofrece servicios en esta zona
            $table->foreignId('professional_id')->constrained('users')->onDelete('cascade');
            
            // Tipo de zona
            $table->enum('zone_type', [
                'fixed_location',    // Ubicación fija (ej: mi estudio en mi casa)
                'service_area',      // Área de cobertura (ej: todo Escazú)
                'home_service_only'  // Solo a domicilio (sin ubicación fija)
            ])->default('service_area');
            
            // Nombre/descripción de la zona
            $table->string('zone_name')->nullable(); // "Mi estudio en Curridabat", "Zona San José"
            
            // Dirección exacta (solo si zone_type = fixed_location)
            $table->string('address')->nullable();
            $table->string('province')->nullable();
            $table->string('canton')->nullable();
            $table->string('district')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Área de cobertura (si zone_type = service_area o home_service_only)
            $table->json('coverage_areas')->nullable(); // ["San José", "Escazú", "Santa Ana"]
            $table->decimal('coverage_radius_km')->nullable(); // Radio desde ubicación fija
            
            // Disponibilidad
            $table->boolean('available_online')->default(true);
            $table->boolean('available_walk_in')->default(false); // Solo si tiene fixed_location
            $table->boolean('available_home_service')->default(true);
            
            // Horarios (JSON)
            $table->json('business_hours')->nullable();
            
            // Prioridad (para ordenar zonas del profesional)
            $table->unsignedTinyInteger('priority')->default(1);
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Índices
            $table->index(['professional_id', 'is_active']);
            $table->index(['tenant_id', 'zone_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professional_service_zones');
    }
};
