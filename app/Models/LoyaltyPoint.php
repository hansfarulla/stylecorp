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
 * Class LoyaltyPoint
 * 
 * @property int $id
 * @property string|null $tenant_id
 * @property int|null $establishment_id
 * @property int|null $professional_id
 * @property int $user_id
 * @property int $points
 * @property int $lifetime_points
 * @property string $tier
 * @property float $points_multiplier
 * @property Carbon|null $tier_expiration_date
 * @property Carbon|null $last_activity_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Establishment|null $establishment
 * @property User $user
 * @property Tenant|null $tenant
 * @property Collection|LoyaltyPointTransaction[] $loyalty_point_transactions
 *
 * @package App\Models
 */
class LoyaltyPoint extends Model
{
	use BelongsToTenant;
	protected $table = 'loyalty_points';

	protected $casts = [
		'establishment_id' => 'int',
		'professional_id' => 'int',
		'user_id' => 'int',
		'points' => 'int',
		'lifetime_points' => 'int',
		'points_multiplier' => 'float',
		'tier_expiration_date' => 'datetime',
		'last_activity_at' => 'datetime'
	];

	protected $fillable = [
		'tenant_id',
		'establishment_id',
		'professional_id',
		'user_id',
		'points',
		'lifetime_points',
		'tier',
		'points_multiplier',
		'tier_expiration_date',
		'last_activity_at'
	];

	public function establishment()
	{
		return $this->belongsTo(Establishment::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}

	public function loyalty_point_transactions()
	{
		return $this->hasMany(LoyaltyPointTransaction::class, 'loyalty_points_id');
	}
}
