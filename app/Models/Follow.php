<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class Follow
 * 
 * @property int $id
 * @property int $follower_id
 * @property int $professional_id
 * @property bool $notify_new_work
 * @property bool $notify_location_change
 * @property bool $notify_availability
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property User $user
 *
 * @package App\Models
 */
class Follow extends Model
{
	use BelongsToTenant;
	protected $table = 'follows';

	protected $casts = [
		'follower_id' => 'int',
		'professional_id' => 'int',
		'notify_new_work' => 'bool',
		'notify_location_change' => 'bool',
		'notify_availability' => 'bool'
	];

	protected $fillable = [
		'follower_id',
		'professional_id',
		'notify_new_work',
		'notify_location_change',
		'notify_availability'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'professional_id');
	}
}
