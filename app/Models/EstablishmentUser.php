<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class EstablishmentUser
 * 
 * @property int $id
 * @property int $establishment_id
 * @property int $user_id
 * @property string $role
 * @property string $commission_model
 * @property float|null $commission_percentage
 * @property string|null $commission_tiers
 * @property float|null $fixed_amount_per_service
 * @property float|null $base_salary
 * @property float|null $booth_rental_fee
 * @property bool $tips_included_in_commission
 * @property string $payment_period
 * @property string $status
 * @property Carbon|null $start_date
 * @property Carbon|null $end_date
 * @property string|null $agreement_terms
 * @property Carbon|null $agreement_signed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Establishment $establishment
 * @property User $user
 *
 * @package App\Models
 */
class EstablishmentUser extends Model
{
	use BelongsToTenant;
	protected $table = 'establishment_user';

	protected $casts = [
		'establishment_id' => 'int',
		'user_id' => 'int',
		'commission_percentage' => 'float',
		'fixed_amount_per_service' => 'float',
		'base_salary' => 'float',
		'booth_rental_fee' => 'float',
		'tips_included_in_commission' => 'bool',
		'auto_accept_appointments' => 'bool',
		'start_date' => 'datetime',
		'end_date' => 'datetime',
		'agreement_signed_at' => 'datetime'
	];

	protected $fillable = [
		'establishment_id',
		'user_id',
		'role',
		'commission_model',
		'commission_percentage',
		'commission_tiers',
		'fixed_amount_per_service',
		'base_salary',
		'booth_rental_fee',
		'tips_included_in_commission',
		'payment_period',
		'status',
		'auto_accept_appointments',
		'start_date',
		'end_date',
		'agreement_terms',
		'agreement_signed_at'
	];

	public function establishment()
	{
		return $this->belongsTo(Establishment::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
