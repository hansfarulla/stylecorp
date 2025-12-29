<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class Notification
 * 
 * @property int $id
 * @property int $user_id
 * @property string $type
 * @property string $channel
 * @property string $title
 * @property string $message
 * @property string|null $data
 * @property string|null $action_url
 * @property bool $is_read
 * @property Carbon|null $read_at
 * @property bool $is_sent
 * @property Carbon|null $sent_at
 * @property Carbon|null $scheduled_for
 * @property string|null $external_id
 * @property string|null $delivery_status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property User $user
 *
 * @package App\Models
 */
class Notification extends Model
{
	use BelongsToTenant;
	protected $table = 'notifications';

	protected $casts = [
		'user_id' => 'int',
		'is_read' => 'bool',
		'read_at' => 'datetime',
		'is_sent' => 'bool',
		'sent_at' => 'datetime',
		'scheduled_for' => 'datetime'
	];

	protected $fillable = [
		'user_id',
		'type',
		'channel',
		'title',
		'message',
		'data',
		'action_url',
		'is_read',
		'read_at',
		'is_sent',
		'sent_at',
		'scheduled_for',
		'external_id',
		'delivery_status'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
