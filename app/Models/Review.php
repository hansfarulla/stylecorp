<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class Review
 * 
 * @property int $id
 * @property string|null $tenant_id
 * @property int|null $establishment_id
 * @property int|null $professional_id
 * @property int $customer_id
 * @property int|null $appointment_id
 * @property int $rating
 * @property string|null $comment
 * @property string|null $photos
 * @property string $status
 * @property bool $is_verified
 * @property string|null $response
 * @property int|null $responded_by
 * @property Carbon|null $responded_at
 * @property int $reports_count
 * @property string|null $moderation_notes
 * @property int $helpful_count
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Appointment|null $appointment
 * @property User|null $user
 * @property Establishment|null $establishment
 * @property Tenant|null $tenant
 *
 * @package App\Models
 */
class Review extends Model
{
	use SoftDeletes;
	use BelongsToTenant;
	protected $table = 'reviews';

	protected $casts = [
		'establishment_id' => 'int',
		'professional_id' => 'int',
		'customer_id' => 'int',
		'appointment_id' => 'int',
		'rating' => 'int',
		'is_verified' => 'bool',
		'responded_by' => 'int',
		'responded_at' => 'datetime',
		'reports_count' => 'int',
		'helpful_count' => 'int'
	];

	protected $fillable = [
		'tenant_id',
		'establishment_id',
		'professional_id',
		'customer_id',
		'appointment_id',
		'rating',
		'comment',
		'photos',
		'status',
		'is_verified',
		'response',
		'responded_by',
		'responded_at',
		'reports_count',
		'moderation_notes',
		'helpful_count'
	];

	public function appointment()
	{
		return $this->belongsTo(Appointment::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class, 'responded_by');
	}

	public function establishment()
	{
		return $this->belongsTo(Establishment::class);
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}
}
