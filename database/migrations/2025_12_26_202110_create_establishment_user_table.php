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
        Schema::create('establishment_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('establishment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['manager', 'staff', 'freelancer'])->default('staff');
            
            // Tipo de vinculación laboral
            // 'employee' = Empleado directo del establecimiento (pertenece al local)
            // 'freelancer' = Profesional independiente colaborando temporalmente
            $table->enum('employment_type', ['employee', 'freelancer'])->default('employee');
            
            // Configuración de comisiones
            $table->enum('commission_model', ['percentage', 'tiered', 'fixed_per_service', 'salary_plus', 'booth_rental', 'salary_only'])->default('percentage');
            $table->decimal('commission_percentage', 5, 2)->nullable(); // 60.00 = 60%
            $table->json('commission_tiers')->nullable(); // [{min: 0, max: 50000, rate: 50}, {min: 50001, max: null, rate: 60}]
            $table->decimal('fixed_amount_per_service', 10, 2)->nullable();
            $table->decimal('base_salary', 10, 2)->nullable();
            $table->decimal('booth_rental_fee', 10, 2)->nullable();
            $table->boolean('tips_included_in_commission')->default(false);
            $table->enum('payment_period', ['daily', 'weekly', 'biweekly', 'monthly'])->default('weekly');
            
            // Estado y fechas
            $table->enum('status', ['pending', 'active', 'inactive'])->default('pending');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->json('agreement_terms')->nullable(); // Términos del acuerdo laboral
            $table->timestamp('agreement_signed_at')->nullable();
            
            $table->timestamps();
            
            // Índices
            $table->unique(['establishment_id', 'user_id']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('establishment_user');
    }
};
