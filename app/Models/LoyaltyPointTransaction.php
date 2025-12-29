<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class LoyaltyPointTransaction
 * 
 * @property int $id
 * @property int $loyalty_points_id
 * @property int $user_id
 * @property int|null $appointment_id
 * @property string $type
 * @property int $points
 * @property int $balance_after
 * @property string $description
 * @property Carbon|null $expires_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Appointment|null $appointment
 * @property LoyaltyPoint $loyalty_point
 * @property User $user
 *
 * @package App\Models
 */
class LoyaltyPointTransaction extends Model
{
	use BelongsToTenant;
	protected $table = 'loyalty_point_transactions';

	protected $casts = [
		'loyalty_points_id' => 'int',
		'user_id' => 'int',
		'appointment_id' => 'int',
		'points' => 'int',
		'balance_after' => 'int',
		'expires_at' => 'datetime'
	];

	protected $fillable = [
		'loyalty_points_id',
		'user_id',
		'appointment_id',
		'type',
		'points',
		'balance_after',
		'description',
		'expires_at'
	];

	public function appointment()
	{
		return $this->belongsTo(Appointment::class);
	}

	public function loyalty_point()
	{
		return $this->belongsTo(LoyaltyPoint::class, 'loyalty_points_id');
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
