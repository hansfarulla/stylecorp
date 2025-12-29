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
        Schema::create('loyalty_points', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->nullable()->index();
            $table->foreignId('establishment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('professional_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            // Puntos
            $table->integer('points')->default(0);
            $table->integer('lifetime_points')->default(0); // Total acumulado históricamente
            $table->enum('tier', ['bronze', 'silver', 'gold', 'platinum'])->default('bronze');
            
            // Configuración
            $table->decimal('points_multiplier', 3, 2)->default(1.00); // 1.5x para platino
            $table->date('tier_expiration_date')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            
            $table->timestamps();
            
            // Índices
            // Un cliente puede tener puntos con un establecimiento O con un profesional independiente
            $table->index(['establishment_id', 'user_id']);
            $table->index(['professional_id', 'user_id']);
            $table->index(['user_id', 'points']);
            $table->index('tier');
        });

        // Tabla de transacciones de puntos
        Schema::create('loyalty_point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loyalty_points_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained()->nullOnDelete();
            
            // Transacción
            $table->enum('type', ['earned', 'redeemed', 'expired', 'bonus', 'referral', 'birthday', 'review'])->default('earned');
            $table->integer('points'); // Positivo para ganancias, negativo para canjes
            $table->integer('balance_after');
            $table->text('description');
            $table->date('expires_at')->nullable();
            
            $table->timestamps();
            
            // Índices
            $table->index(['user_id', 'created_at']);
            $table->index(['loyalty_points_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loyalty_points');
    }
};
