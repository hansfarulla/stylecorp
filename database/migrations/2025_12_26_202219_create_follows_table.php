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
        Schema::create('follows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('follower_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('professional_id')->constrained('users')->cascadeOnDelete();
            
            // Preferencias de notificaciones
            $table->boolean('notify_new_work')->default(true);
            $table->boolean('notify_location_change')->default(true);
            $table->boolean('notify_availability')->default(true);
            
            $table->timestamps();
            
            // Índices
            $table->unique(['follower_id', 'professional_id']);
            $table->index(['professional_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follows');
    }
};
