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
        Schema::create('workstation_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('establishment_id')->constrained()->onDelete('cascade');
            $table->foreignId('workstation_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->enum('employment_type', ['employee', 'freelancer'])->default('freelancer');
            $table->enum('commission_model', ['percentage', 'salary_plus', 'booth_rental', 'fixed_per_service', 'salary_only']);
            $table->decimal('commission_percentage', 5, 2)->nullable();
            $table->decimal('base_salary', 10, 2)->nullable();
            $table->decimal('booth_rental_fee', 10, 2)->nullable();
            $table->json('schedule')->nullable(); // Horario ofertado
            $table->date('deadline')->nullable(); // Fecha límite para aplicar
            $table->enum('status', ['active', 'closed', 'filled'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workstation_offers');
    }
};
