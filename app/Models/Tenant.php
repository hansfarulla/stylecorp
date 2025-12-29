<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class Tenant
 * 
 * @property string $id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string $subscription_plan
 * @property string $subscription_status
 * @property Carbon|null $trial_ends_at
 * @property Carbon|null $subscription_ends_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $data
 * 
 * @property Collection|Appointment[] $appointments
 * @property Collection|Domain[] $domains
 * @property Collection|EstablishmentExpense[] $establishment_expenses
 * @property Collection|Establishment[] $establishments
 * @property Collection|FinancialReport[] $financial_reports
 * @property Collection|LoyaltyPoint[] $loyalty_points
 * @property Collection|ProfessionalExpense[] $professional_expenses
 * @property Collection|ProfessionalServiceZone[] $professional_service_zones
 * @property Collection|Review[] $reviews
 * @property Collection|Service[] $services
 * @property Collection|Transaction[] $transactions
 *
 * @package App\Models
 */
class Tenant extends Model
{
	use BelongsToTenant;
	protected $table = 'tenants';
	public $incrementing = false;

	protected $casts = [
		'trial_ends_at' => 'datetime',
		'subscription_ends_at' => 'datetime'
	];

	protected $fillable = [
		'name',
		'email',
		'phone',
		'subscription_plan',
		'subscription_status',
		'trial_ends_at',
		'subscription_ends_at',
		'data'
	];

	public function appointments()
	{
		return $this->hasMany(Appointment::class);
	}

	public function domains()
	{
		return $this->hasMany(Domain::class);
	}

	public function establishment_expenses()
	{
		return $this->hasMany(EstablishmentExpense::class);
	}

	public function establishments()
	{
		return $this->hasMany(Establishment::class);
	}

	public function financial_reports()
	{
		return $this->hasMany(FinancialReport::class);
	}

	public function loyalty_points()
	{
		return $this->hasMany(LoyaltyPoint::class);
	}

	public function professional_expenses()
	{
		return $this->hasMany(ProfessionalExpense::class);
	}

	public function professional_service_zones()
	{
		return $this->hasMany(ProfessionalServiceZone::class);
	}

	public function reviews()
	{
		return $this->hasMany(Review::class);
	}

	public function services()
	{
		return $this->hasMany(Service::class);
	}

	public function transactions()
	{
		return $this->hasMany(Transaction::class);
	}
}
