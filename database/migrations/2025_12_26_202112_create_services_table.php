<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->nullable()->index();
            $table->foreignId('establishment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('professional_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            
            // Información básica
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('slug');
            $table->enum('category', ['cut', 'beard', 'coloring', 'styling', 'treatment', 'waxing', 'facial', 'massage', 'nails', 'makeup', 'other'])->default('cut');
            
            // Precios
            $table->decimal('base_price', 10, 2);
            $table->boolean('price_varies_by_professional')->default(false);
            $table->json('professional_prices')->nullable(); // {user_id: price}
            
            // Duración
            $table->integer('duration_minutes');
            $table->integer('buffer_time_minutes')->default(0); // Tiempo entre citas
            
            // Disponibilidad
            $table->boolean('available_online')->default(true);
            $table->boolean('available_home_service')->default(false);
            $table->decimal('home_service_surcharge', 10, 2)->default(0);
            
            // Ubicación para profesionales independientes (sin establishment)
            $table->string('independent_address')->nullable();
            $table->string('independent_province')->nullable();
            $table->string('independent_canton')->nullable();
            $table->string('independent_district')->nullable();
            $table->decimal('independent_latitude', 10, 8)->nullable();
            $table->decimal('independent_longitude', 11, 8)->nullable();
            
            // Multimedia
            $table->json('images')->nullable(); // Array de URLs
            $table->json('requirements')->nullable(); // Requisitos especiales
            
            // Estado
            $table->boolean('is_active')->default(true);
            $table->boolean('is_package')->default(false); // Si es paquete de varios servicios
            $table->json('package_services')->nullable(); // Array de service_ids si es paquete
            
            // Métricas
            $table->integer('total_bookings')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['establishment_id', 'is_active']);
            $table->index(['tenant_id', 'category']);
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
