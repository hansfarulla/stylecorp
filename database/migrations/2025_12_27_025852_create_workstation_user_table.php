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
        Schema::create('workstation_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workstation_id')->constrained('workstations')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->time('start_time')->nullable()->comment('Hora de inicio del turno (opcional)');
            $table->time('end_time')->nullable()->comment('Hora de fin del turno (opcional)');
            $table->json('days')->nullable()->comment('Días de la semana que trabaja (opcional)');
            $table->text('notes')->nullable()->comment('Notas adicionales sobre la asignación');
            $table->timestamps();
            
            // Índice único con nombre corto
            $table->unique(['workstation_id', 'user_id', 'start_time', 'end_time'], 'ws_user_schedule_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workstation_user');
    }
};
