<?php

namespace Database\Seeders;

use App\Enums\ExpenseType;
use App\Models\Establishment;
use App\Models\EstablishmentExpense;
use App\Models\FinancialReport;
use App\Models\ProfessionalExpense;
use App\Models\User;
use Illuminate\Database\Seeder;

class FinancialSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = \App\Models\Tenant::where('id', 'stylecorp-demo')->first();
        $elClasico = Establishment::where('slug', 'barberia-el-clasico')->first();
        $luis = User::where('email', 'luis.martinez@gmail.com')->first();

        // === GASTOS DE LUIS (PROFESIONAL INDEPENDIENTE) ===
        
        // Alquiler de silla en El Clásico
        ProfessionalExpense::create([
            'tenant_id' => $tenant->id,
            'professional_id' => $luis->id,
            'establishment_id' => $elClasico->id,
            'expense_type' => ExpenseType::BOOTH_RENTAL->value,
            'description' => 'Alquiler silla viernes y sábado - Diciembre',
            'amount' => 30000,
            'expense_date' => now()->format('Y-m-d'),
            'is_recurring' => true,
            'recurrence_period' => 'monthly',
            'tax_deductible' => true,
        ]);

        // Productos (shampoo, gel, cera)
        ProfessionalExpense::create([
            'tenant_id' => $tenant->id,
            'professional_id' => $luis->id,
            'expense_type' => ExpenseType::PRODUCT_SUPPLIES->value,
            'description' => 'Shampoo profesional, gel modelador, cera mate',
            'amount' => 18500,
            'expense_date' => now()->subDays(10)->format('Y-m-d'),
            'tax_deductible' => true,
        ]);

        // Transporte (gasolina servicios a domicilio)
        ProfessionalExpense::create([
            'tenant_id' => $tenant->id,
            'professional_id' => $luis->id,
            'expense_type' => ExpenseType::TRANSPORTATION->value,
            'description' => 'Gasolina para servicios a domicilio - Diciembre',
            'amount' => 25000,
            'expense_date' => now()->subDays(5)->format('Y-m-d'),
            'is_recurring' => true,
            'recurrence_period' => 'monthly',
            'tax_deductible' => true,
        ]);

        // Herramientas (máquina nueva)
        ProfessionalExpense::create([
            'tenant_id' => $tenant->id,
            'professional_id' => $luis->id,
            'expense_type' => ExpenseType::TOOLS->value,
            'description' => 'Máquina Wahl Magic Clip Cordless',
            'amount' => 85000,
            'expense_date' => now()->subDays(20)->format('Y-m-d'),
            'tax_deductible' => true,
        ]);

        echo "✅ Luis - 4 gastos registrados (Total: ₡158,500)\n";

        // === GASTOS DE BARBERÍA EL CLÁSICO ===
        
        // Alquiler del local
        EstablishmentExpense::create([
            'tenant_id' => $tenant->id,
            'establishment_id' => $elClasico->id,
            'expense_type' => ExpenseType::RENT->value,
            'description' => 'Alquiler local Av. Central - Diciembre',
            'amount' => 450000,
            'expense_date' => now()->startOfMonth()->format('Y-m-d'),
            'is_recurring' => true,
            'recurrence_period' => 'monthly',
            'vendor_name' => 'Inmobiliaria San José S.A.',
            'tax_deductible' => true,
        ]);

        // Servicios (luz, agua, internet)
        EstablishmentExpense::create([
            'tenant_id' => $tenant->id,
            'establishment_id' => $elClasico->id,
            'expense_type' => ExpenseType::UTILITIES->value,
            'description' => 'Electricidad, agua, internet - Diciembre',
            'amount' => 95000,
            'expense_date' => now()->subDays(5)->format('Y-m-d'),
            'is_recurring' => true,
            'recurrence_period' => 'monthly',
            'tax_deductible' => true,
        ]);

        // Salarios base
        EstablishmentExpense::create([
            'tenant_id' => $tenant->id,
            'establishment_id' => $elClasico->id,
            'expense_type' => ExpenseType::SALARIES->value,
            'description' => 'Salario base María González - Diciembre',
            'amount' => 300000,
            'expense_date' => now()->endOfMonth()->format('Y-m-d'),
            'is_recurring' => true,
            'recurrence_period' => 'monthly',
            'tax_deductible' => true,
        ]);

        // Comisiones pagadas (calculado del mes)
        EstablishmentExpense::create([
            'tenant_id' => $tenant->id,
            'establishment_id' => $elClasico->id,
            'expense_type' => ExpenseType::COMMISSIONS->value,
            'description' => 'Comisiones profesionales - Diciembre',
            'amount' => 620000,
            'expense_date' => now()->endOfMonth()->format('Y-m-d'),
            'auto_calculated' => true,
            'tax_deductible' => true,
        ]);

        // Inventario de productos
        EstablishmentExpense::create([
            'tenant_id' => $tenant->id,
            'establishment_id' => $elClasico->id,
            'expense_type' => ExpenseType::PRODUCT_INVENTORY->value,
            'description' => 'Restock productos (shampoos, geles, pomadas)',
            'amount' => 135000,
            'expense_date' => now()->subDays(15)->format('Y-m-d'),
            'vendor_name' => 'Distribuidora Profesional CR',
            'tax_deductible' => true,
        ]);

        // Software StyleCore
        EstablishmentExpense::create([
            'tenant_id' => $tenant->id,
            'establishment_id' => $elClasico->id,
            'expense_type' => ExpenseType::SOFTWARE->value,
            'description' => 'Suscripción StyleCore Premium - Diciembre',
            'amount' => 35000,
            'expense_date' => now()->startOfMonth()->format('Y-m-d'),
            'is_recurring' => true,
            'recurrence_period' => 'monthly',
            'vendor_name' => 'StyleCorp',
            'tax_deductible' => true,
        ]);

        // Mantenimiento
        EstablishmentExpense::create([
            'tenant_id' => $tenant->id,
            'establishment_id' => $elClasico->id,
            'expense_type' => ExpenseType::MAINTENANCE->value,
            'description' => 'Reparación aire acondicionado + pintura',
            'amount' => 75000,
            'expense_date' => now()->subDays(8)->format('Y-m-d'),
            'vendor_name' => 'Servicios Técnicos CR',
            'tax_deductible' => true,
        ]);

        echo "✅ El Clásico - 7 gastos registrados (Total: ₡1,710,000)\n";

        // === REPORTES FINANCIEROS ===
        
        // Reporte mensual de Luis (Diciembre)
        FinancialReport::create([
            'tenant_id' => $tenant->id,
            'entity_type' => 'professional',
            'entity_id' => $luis->id,
            'period_type' => 'monthly',
            'period_start' => now()->startOfMonth(),
            'period_end' => now()->endOfMonth(),
            
            // Ingresos
            'total_revenue' => 485000,
            'total_appointments' => 32,
            'average_ticket' => 15156,
            
            // Gastos
            'total_expenses' => 158500,
            'booth_rental_expenses' => 30000,
            'product_expenses' => 18500,
            'transportation_expenses' => 25000,
            'other_professional_expenses' => 85000, // Herramientas
            
            // Resultado
            'gross_profit' => 485000,
            'net_profit' => 326500, // ₡485k - ₡158.5k
            'profit_margin' => 67.32,
            
            'new_customers' => 8,
            'returning_customers' => 24,
            'tips_received' => 42000,
            
            'income_by_establishment' => json_encode([
                $elClasico->id => 125000, // Sábados en El Clásico
                'independent' => 360000,  // Servicios propios
            ]),
            
            'generated_at' => now(),
        ]);
        echo "  └─ Reporte Luis (Diciembre): Ganancia neta ₡326,500 (67%)\n";

        // Reporte mensual de El Clásico (Diciembre)
        FinancialReport::create([
            'tenant_id' => $tenant->id,
            'entity_type' => 'establishment',
            'entity_id' => $elClasico->id,
            'period_type' => 'monthly',
            'period_start' => now()->startOfMonth(),
            'period_end' => now()->endOfMonth(),
            
            // Ingresos
            'total_revenue' => 1250000,
            'total_appointments' => 156,
            'average_ticket' => 8013,
            
            // Gastos
            'total_expenses' => 1710000,
            'rent_expense' => 450000,
            'utilities_expense' => 95000,
            'salaries_expense' => 300000,
            'commissions_expense' => 620000,
            'other_establishment_expenses' => 245000, // Productos + software + mantenimiento
            
            // Resultado
            'gross_profit' => 1250000,
            'net_profit' => -460000, // PÉRDIDA
            'profit_margin' => -36.80,
            
            'new_customers' => 42,
            'returning_customers' => 114,
            'tips_received' => 87000,
            
            'commission_breakdown' => json_encode([
                $luis->id => 125000,   // Luis (freelancer)
                'employees' => 495000, // María + José
            ]),
            
            'generated_at' => now(),
        ]);
        echo "  └─ Reporte El Clásico (Diciembre): PÉRDIDA -₡460,000 ⚠️\n";

        echo "\n🎉 Seeders Financieros completados!\n";
        echo "\n📊 RESUMEN:\n";
        echo "   Luis (Independiente): +₡326,500 (67% margen)\n";
        echo "   El Clásico: -₡460,000 (gastos superan ingresos)\n";
        echo "\n💡 El Clásico necesita:\n";
        echo "   - Aumentar precios\n";
        echo "   - Más volumen de clientes\n";
        echo "   - Reducir gastos operativos\n";
    }
}
