<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class FinancialReport
 * 
 * @property int $id
 * @property string $tenant_id
 * @property string $entity_type
 * @property int $entity_id
 * @property string $period_type
 * @property Carbon $period_start
 * @property Carbon $period_end
 * @property float $total_revenue
 * @property int $total_appointments
 * @property float $average_ticket
 * @property float $total_expenses
 * @property float $booth_rental_expenses
 * @property float $product_expenses
 * @property float $transportation_expenses
 * @property float $other_professional_expenses
 * @property float $rent_expense
 * @property float $utilities_expense
 * @property float $salaries_expense
 * @property float $commissions_expense
 * @property float $other_establishment_expenses
 * @property float $gross_profit
 * @property float $net_profit
 * @property float $profit_margin
 * @property int $new_customers
 * @property int $returning_customers
 * @property float $tips_received
 * @property string|null $commission_breakdown
 * @property string|null $income_by_establishment
 * @property Carbon $generated_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Tenant $tenant
 *
 * @package App\Models
 */
class FinancialReport extends Model
{
	use BelongsToTenant;
	protected $table = 'financial_reports';

	protected $casts = [
		'entity_id' => 'int',
		'period_start' => 'datetime',
		'period_end' => 'datetime',
		'total_revenue' => 'float',
		'total_appointments' => 'int',
		'average_ticket' => 'float',
		'total_expenses' => 'float',
		'booth_rental_expenses' => 'float',
		'product_expenses' => 'float',
		'transportation_expenses' => 'float',
		'other_professional_expenses' => 'float',
		'rent_expense' => 'float',
		'utilities_expense' => 'float',
		'salaries_expense' => 'float',
		'commissions_expense' => 'float',
		'other_establishment_expenses' => 'float',
		'gross_profit' => 'float',
		'net_profit' => 'float',
		'profit_margin' => 'float',
		'new_customers' => 'int',
		'returning_customers' => 'int',
		'tips_received' => 'float',
		'generated_at' => 'datetime'
	];

	protected $fillable = [
		'tenant_id',
		'entity_type',
		'entity_id',
		'period_type',
		'period_start',
		'period_end',
		'total_revenue',
		'total_appointments',
		'average_ticket',
		'total_expenses',
		'booth_rental_expenses',
		'product_expenses',
		'transportation_expenses',
		'other_professional_expenses',
		'rent_expense',
		'utilities_expense',
		'salaries_expense',
		'commissions_expense',
		'other_establishment_expenses',
		'gross_profit',
		'net_profit',
		'profit_margin',
		'new_customers',
		'returning_customers',
		'tips_received',
		'commission_breakdown',
		'income_by_establishment',
		'generated_at'
	];

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}
}
