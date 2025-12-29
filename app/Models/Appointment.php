<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class Appointment
 * 
 * @property int $id
 * @property string|null $tenant_id
 * @property int|null $establishment_id
 * @property int $customer_id
 * @property int|null $professional_id
 * @property int $service_id
 * @property string $booking_code
 * @property Carbon $scheduled_at
 * @property Carbon $scheduled_end_at
 * @property int $duration_minutes
 * @property string $location_type
 * @property string|null $home_address
 * @property float|null $home_latitude
 * @property float|null $home_longitude
 * @property string $status
 * @property Carbon|null $confirmed_at
 * @property Carbon|null $started_at
 * @property Carbon|null $completed_at
 * @property Carbon|null $cancelled_at
 * @property string|null $cancellation_reason
 * @property float $service_price
 * @property float $home_service_surcharge
 * @property float $subtotal
 * @property float $discount
 * @property string|null $discount_code
 * @property float $total
 * @property string|null $customer_notes
 * @property string|null $professional_notes
 * @property string|null $internal_notes
 * @property bool $reminder_24h_sent
 * @property bool $reminder_2h_sent
 * @property bool $is_first_visit
 * @property bool $is_repeat_customer
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property User|null $user
 * @property Establishment|null $establishment
 * @property Service $service
 * @property Tenant|null $tenant
 * @property Collection|LoyaltyPointTransaction[] $loyalty_point_transactions
 * @property Review|null $review
 * @property Collection|Transaction[] $transactions
 *
 * @package App\Models
 */
class Appointment extends Model
{
	use SoftDeletes;
	use BelongsToTenant;
	protected $table = 'appointments';

	protected $casts = [
		'establishment_id' => 'int',
		'customer_id' => 'int',
		'professional_id' => 'int',
		'service_id' => 'int',
		'scheduled_at' => 'datetime',
		'scheduled_end_at' => 'datetime',
		'duration_minutes' => 'int',
		'home_latitude' => 'float',
		'home_longitude' => 'float',
		'confirmed_at' => 'datetime',
		'started_at' => 'datetime',
		'completed_at' => 'datetime',
		'cancelled_at' => 'datetime',
		'service_price' => 'float',
		'home_service_surcharge' => 'float',
		'subtotal' => 'float',
		'discount' => 'float',
		'total' => 'float',
		'reminder_24h_sent' => 'bool',
		'reminder_2h_sent' => 'bool',
		'is_first_visit' => 'bool',
		'is_repeat_customer' => 'bool'
	];

	protected $fillable = [
		'tenant_id',
		'establishment_id',
		'customer_id',
		'professional_id',
		'service_id',
		'booking_code',
		'scheduled_at',
		'scheduled_end_at',
		'duration_minutes',
		'location_type',
		'home_address',
		'home_latitude',
		'home_longitude',
		'status',
		'confirmed_at',
		'started_at',
		'completed_at',
		'cancelled_at',
		'cancellation_reason',
		'service_price',
		'home_service_surcharge',
		'subtotal',
		'discount',
		'discount_code',
		'total',
		'customer_notes',
		'professional_notes',
		'internal_notes',
		'reminder_24h_sent',
		'reminder_2h_sent',
		'is_first_visit',
		'is_repeat_customer'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'professional_id');
	}

	public function professional()
	{
		return $this->belongsTo(User::class, 'professional_id');
	}

	public function customer()
	{
		return $this->belongsTo(User::class, 'customer_id');
	}

	public function establishment()
	{
		return $this->belongsTo(Establishment::class);
	}

	public function service()
	{
		return $this->belongsTo(Service::class);
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}

	public function loyalty_point_transactions()
	{
		return $this->hasMany(LoyaltyPointTransaction::class);
	}

	public function review()
	{
		return $this->hasOne(Review::class);
	}

	public function transactions()
	{
		return $this->hasMany(Transaction::class);
	}
}
