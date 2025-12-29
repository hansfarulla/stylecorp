<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Reportes financieros pre-calculados para análisis rápido.
     * Se generan diaria, semanal o mensualmente para evitar
     * cálculos pesados en tiempo real.
     */
    public function up(): void
    {
        Schema::create('financial_reports', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            
            // Tipo de entidad
            $table->enum('entity_type', ['professional', 'establishment']);
            $table->unsignedBigInteger('entity_id'); // professional_id o establishment_id
            
            // Período del reporte
            $table->enum('period_type', ['daily', 'weekly', 'monthly', 'yearly']);
            $table->date('period_start');
            $table->date('period_end');
            
            // === INGRESOS ===
            $table->decimal('total_revenue', 12, 2)->default(0); // Ingresos totales
            $table->integer('total_appointments')->default(0); // Cantidad de citas
            $table->decimal('average_ticket', 10, 2)->default(0); // Ticket promedio
            
            // === GASTOS ===
            $table->decimal('total_expenses', 12, 2)->default(0); // Gastos totales
            
            // Desglose de gastos (para profesionales)
            $table->decimal('booth_rental_expenses', 10, 2)->default(0);
            $table->decimal('product_expenses', 10, 2)->default(0);
            $table->decimal('transportation_expenses', 10, 2)->default(0);
            $table->decimal('other_professional_expenses', 10, 2)->default(0);
            
            // Desglose de gastos (para establecimientos)
            $table->decimal('rent_expense', 10, 2)->default(0);
            $table->decimal('utilities_expense', 10, 2)->default(0);
            $table->decimal('salaries_expense', 10, 2)->default(0);
            $table->decimal('commissions_expense', 10, 2)->default(0);
            $table->decimal('other_establishment_expenses', 10, 2)->default(0);
            
            // === RESULTADO ===
            $table->decimal('gross_profit', 12, 2)->default(0); // Ganancia bruta
            $table->decimal('net_profit', 12, 2)->default(0); // Ganancia neta (después de gastos)
            $table->decimal('profit_margin', 5, 2)->default(0); // % de margen
            
            // === MÉTRICAS ADICIONALES ===
            $table->integer('new_customers')->default(0);
            $table->integer('returning_customers')->default(0);
            $table->decimal('tips_received', 10, 2)->default(0);
            
            // Para establecimientos: comisiones pagadas por profesional
            $table->json('commission_breakdown')->nullable(); // {professional_id: amount}
            
            // Para profesionales: ingresos por establecimiento
            $table->json('income_by_establishment')->nullable(); // {establishment_id: amount}
            
            $table->timestamp('generated_at');
            $table->timestamps();
            
            // Índices
            $table->index(['entity_type', 'entity_id', 'period_start']);
            $table->index(['tenant_id', 'period_type']);
            $table->unique(['entity_type', 'entity_id', 'period_type', 'period_start'], 'financial_reports_unique_period');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_reports');
    }
};
