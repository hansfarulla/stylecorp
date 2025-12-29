<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Gastos operativos de profesionales independientes o empleados.
     * Permite calcular ganancia neta: ingresos - gastos.
     */
    public function up(): void
    {
        Schema::create('professional_expenses', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            
            $table->foreignId('professional_id')->constrained('users')->onDelete('cascade');
            
            // Si el gasto está asociado a un establecimiento específico
            $table->foreignId('establishment_id')->nullable()->constrained()->onDelete('set null');
            
            // Tipo de gasto
            $table->enum('expense_type', [
                'booth_rental',        // Alquiler de silla/espacio
                'product_supplies',    // Productos (shampoo, tintes, etc.)
                'tools',               // Herramientas (tijeras, máquinas, etc.)
                'transportation',      // Gasolina, transporte a domicilio
                'marketing',           // Publicidad, redes sociales
                'insurance',           // Seguros
                'education',           // Cursos, capacitaciones
                'other'                // Otros gastos
            ]);
            
            $table->string('description');
            $table->decimal('amount', 10, 2);
            $table->date('expense_date');
            
            // Recurrencia (para gastos fijos)
            $table->boolean('is_recurring')->default(false);
            $table->enum('recurrence_period', ['daily', 'weekly', 'biweekly', 'monthly', 'yearly'])->nullable();
            
            // Comprobante
            $table->string('receipt_url')->nullable();
            $table->string('invoice_number')->nullable();
            
            // Categoría de impuestos (deducible o no)
            $table->boolean('tax_deductible')->default(true);
            
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Índices
            $table->index(['professional_id', 'expense_date']);
            $table->index(['tenant_id', 'expense_type']);
            $table->index('is_recurring');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professional_expenses');
    }
};
