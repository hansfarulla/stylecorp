<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabla de permisos disponibles en el sistema
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->nullable();
            $table->string('name')->unique(); // Ej: 'staff.manage', 'bookings.create'
            $table->string('label'); // Nombre legible: 'Gestionar Personal'
            $table->text('description')->nullable();
            $table->string('category'); // 'staff', 'bookings', 'services', etc.
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')
                ->onUpdate('cascade')->onDelete('cascade');
        });

        // Tabla pivot: permisos asignados a usuarios específicos
        Schema::create('permission_user', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->nullable();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->foreignId('establishment_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('granted')->default(true); // true = concedido, false = denegado explícitamente
            $table->foreignId('granted_by')->nullable()->constrained('users')->nullOnDelete(); // Quién otorgó el permiso
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')
                ->onUpdate('cascade')->onDelete('cascade');

            // Un usuario no puede tener el mismo permiso duplicado para el mismo establecimiento
            $table->unique(['user_id', 'permission_id', 'establishment_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_user');
        Schema::dropIfExists('permissions');
    }
};
