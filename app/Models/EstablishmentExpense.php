<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class EstablishmentExpense
 * 
 * @property int $id
 * @property string $tenant_id
 * @property int $establishment_id
 * @property string $expense_type
 * @property string $description
 * @property float $amount
 * @property Carbon $expense_date
 * @property bool $is_recurring
 * @property string|null $recurrence_period
 * @property bool $auto_calculated
 * @property string|null $receipt_url
 * @property string|null $invoice_number
 * @property string|null $vendor_name
 * @property bool $tax_deductible
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Establishment $establishment
 * @property Tenant $tenant
 *
 * @package App\Models
 */
class EstablishmentExpense extends Model
{
	use BelongsToTenant;
	protected $table = 'establishment_expenses';

	protected $casts = [
		'establishment_id' => 'int',
		'amount' => 'float',
		'expense_date' => 'datetime',
		'is_recurring' => 'bool',
		'auto_calculated' => 'bool',
		'tax_deductible' => 'bool'
	];

	protected $fillable = [
		'tenant_id',
		'establishment_id',
		'expense_type',
		'description',
		'amount',
		'expense_date',
		'is_recurring',
		'recurrence_period',
		'auto_calculated',
		'receipt_url',
		'invoice_number',
		'vendor_name',
		'tax_deductible',
		'notes'
	];

	public function establishment()
	{
		return $this->belongsTo(Establishment::class);
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}
}
