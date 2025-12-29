<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class Favorite
 * 
 * @property int $id
 * @property int $user_id
 * @property int $establishment_id
 * @property string|null $category
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Establishment $establishment
 * @property User $user
 *
 * @package App\Models
 */
class Favorite extends Model
{
	use BelongsToTenant;
	protected $table = 'favorites';

	protected $casts = [
		'user_id' => 'int',
		'establishment_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'establishment_id',
		'category',
		'notes'
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
