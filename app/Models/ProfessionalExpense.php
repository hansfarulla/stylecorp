<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class ProfessionalExpense
 * 
 * @property int $id
 * @property string $tenant_id
 * @property int $professional_id
 * @property int|null $establishment_id
 * @property string $expense_type
 * @property string $description
 * @property float $amount
 * @property Carbon $expense_date
 * @property bool $is_recurring
 * @property string|null $recurrence_period
 * @property string|null $receipt_url
 * @property string|null $invoice_number
 * @property bool $tax_deductible
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Establishment|null $establishment
 * @property User $user
 * @property Tenant $tenant
 *
 * @package App\Models
 */
class ProfessionalExpense extends Model
{
	use BelongsToTenant;
	protected $table = 'professional_expenses';

	protected $casts = [
		'professional_id' => 'int',
		'establishment_id' => 'int',
		'amount' => 'float',
		'expense_date' => 'datetime',
		'is_recurring' => 'bool',
		'tax_deductible' => 'bool'
	];

	protected $fillable = [
		'tenant_id',
		'professional_id',
		'establishment_id',
		'expense_type',
		'description',
		'amount',
		'expense_date',
		'is_recurring',
		'recurrence_period',
		'receipt_url',
		'invoice_number',
		'tax_deductible',
		'notes'
	];

	public function establishment()
	{
		return $this->belongsTo(Establishment::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class, 'professional_id');
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}
}
