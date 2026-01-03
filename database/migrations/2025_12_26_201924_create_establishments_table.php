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
        Schema::create('establishments', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->nullable()->index();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            
            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            
            // Información básica
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('business_name')->nullable(); // Razón social
            $table->string('tax_id')->nullable(); // Cédula jurídica/RUC
            // Solo establecimientos físicos reales
            $table->enum('type', ['barbershop', 'salon', 'spa', 'mixed'])->default('mixed');
            
            // Contacto
            $table->string('email')->nullable();
            $table->string('phone');
            $table->string('whatsapp')->nullable();
            $table->string('website')->nullable();
            
            // Ubicación
            $table->string('address');
            $table->string('province'); // Provincia
            $table->string('canton'); // Cantón
            $table->string('district'); // Distrito
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Multimedia
            $table->string('logo')->nullable();
            $table->json('gallery')->nullable(); // Array de URLs de fotos
            $table->string('cover_image')->nullable();
            
            // Branding
            $table->json('corporate_colors')->nullable(); // {primary: '#xxx', secondary: '#xxx'}
            $table->string('subdomain')->nullable()->unique();
            
            // Configuraciones
            $table->json('business_hours')->nullable(); // {monday: {open: '09:00', close: '18:00', closed: false}, ...}
            $table->boolean('accepts_walk_ins')->default(true);
            $table->boolean('offers_home_service')->default(false);
            $table->json('home_service_zones')->nullable(); // Array de zonas donde ofrece servicio a domicilio
            $table->integer('min_booking_hours')->default(2); // Horas mínimas de anticipación
            
            // Políticas
            $table->text('cancellation_policy')->nullable();
            $table->integer('cancellation_hours')->default(24); // Horas antes para cancelar sin penalización
            $table->decimal('cancellation_fee', 10, 2)->default(0);
            $table->decimal('no_show_fee', 10, 2)->default(0);
            
            // Configuración de pagos
            $table->enum('payment_flow', ['centralized', 'decentralized', 'mixed'])->default('centralized');
            $table->json('payment_methods')->nullable(); // ['cash', 'card', 'sinpe', 'transfer']
            
            // Notificaciones
            $table->json('notification_settings')->nullable();
            $table->json('supported_languages')->nullable();
            
            // Estado y verificación
            $table->enum('status', ['pending', 'active', 'suspended', 'inactive'])->default('pending');
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            
            // Métricas
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->integer('total_bookings')->default(0);
            
            // Certificaciones
            $table->json('certifications')->nullable(); // Array de certificaciones StyleCore
            
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['tenant_id', 'status']);
            $table->index(['province', 'canton', 'district']);
            $table->index('slug');
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('establishments');
    }
};
