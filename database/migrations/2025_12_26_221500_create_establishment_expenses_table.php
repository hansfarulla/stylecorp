<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Gastos operativos del establecimiento.
     * Para que los dueños puedan ver: ingresos totales - gastos = ganancia neta.
     */
    public function up(): void
    {
        Schema::create('establishment_expenses', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            
            $table->foreignId('establishment_id')->constrained()->onDelete('cascade');
            
            // Tipo de gasto
            $table->enum('expense_type', [
                'rent',                // Alquiler del local
                'utilities',           // Servicios (luz, agua, internet)
                'salaries',            // Salarios base de empleados
                'commissions',         // Comisiones pagadas a profesionales
                'product_inventory',   // Inventario de productos
                'equipment',           // Equipamiento (sillas, espejos, etc.)
                'maintenance',         // Mantenimiento y reparaciones
                'cleaning',            // Limpieza
                'marketing',           // Publicidad
                'insurance',           // Seguros
                'taxes',               // Impuestos (IVA, renta, etc.)
                'permits',             // Permisos y licencias
                'software',            // Software (incluye StyleCore)
                'other'                // Otros gastos
            ]);
            
            $table->string('description');
            $table->decimal('amount', 10, 2);
            $table->date('expense_date');
            
            // Recurrencia (para gastos fijos mensuales)
            $table->boolean('is_recurring')->default(false);
            $table->enum('recurrence_period', ['daily', 'weekly', 'monthly', 'yearly'])->nullable();
            
            // Si es gasto variable (ej: comisiones que se calculan automáticamente)
            $table->boolean('auto_calculated')->default(false);
            
            // Comprobante
            $table->string('receipt_url')->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('vendor_name')->nullable(); // Proveedor
            
            // Categoría de impuestos
            $table->boolean('tax_deductible')->default(true);
            
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Índices
            $table->index(['establishment_id', 'expense_date']);
            $table->index(['tenant_id', 'expense_type']);
            $table->index('is_recurring');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('establishment_expenses');
    }
};
