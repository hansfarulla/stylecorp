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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->nullable()->index();
            $table->foreignId('establishment_id')->nullable()->constrained()->nullOnDelete();
            
            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('professional_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            
            // establishment_id es nullable para soportar:
            // 1. Profesionales independientes que trabajan desde casa
            // 2. Profesionales que solo hacen servicio a domicilio
            // 3. Ubicaciones no registradas en la app
            
            // Detalles de la cita
            $table->string('booking_code')->unique(); // Código único para referencia
            $table->dateTime('scheduled_at');
            $table->dateTime('scheduled_end_at');
            $table->integer('duration_minutes');
            
            // Ubicación
            $table->enum('location_type', ['in_store', 'home_service'])->default('in_store');
            $table->string('home_address')->nullable();
            $table->decimal('home_latitude', 10, 8)->nullable();
            $table->decimal('home_longitude', 11, 8)->nullable();
            
            // Estado
            $table->enum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled_by_customer', 'cancelled_by_establishment', 'no_show'])->default('pending');
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();
            
            // Precios
            $table->decimal('service_price', 10, 2);
            $table->decimal('home_service_surcharge', 10, 2)->default(0);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->string('discount_code')->nullable();
            $table->decimal('total', 10, 2);
            
            // Notas
            $table->text('customer_notes')->nullable();
            $table->text('professional_notes')->nullable();
            $table->text('internal_notes')->nullable();
            
            // Recordatorios
            $table->boolean('reminder_24h_sent')->default(false);
            $table->boolean('reminder_2h_sent')->default(false);
            
            // Métricas
            $table->boolean('is_first_visit')->default(false);
            $table->boolean('is_repeat_customer')->default(false);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['establishment_id', 'scheduled_at']);
            $table->index(['professional_id', 'scheduled_at']);
            $table->index(['customer_id', 'status']);
            $table->index(['tenant_id', 'status']);
            $table->index('booking_code');
            $table->index(['scheduled_at', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
