<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class ProfessionalServiceZone
 * 
 * @property int $id
 * @property string $tenant_id
 * @property int $professional_id
 * @property string $zone_type
 * @property string|null $zone_name
 * @property string|null $address
 * @property string|null $province
 * @property string|null $canton
 * @property string|null $district
 * @property float|null $latitude
 * @property float|null $longitude
 * @property string|null $coverage_areas
 * @property float|null $coverage_radius_km
 * @property bool $available_online
 * @property bool $available_walk_in
 * @property bool $available_home_service
 * @property string|null $business_hours
 * @property int $priority
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property User $user
 * @property Tenant $tenant
 *
 * @package App\Models
 */
class ProfessionalServiceZone extends Model
{
	use BelongsToTenant;
	protected $table = 'professional_service_zones';

	protected $casts = [
		'professional_id' => 'int',
		'latitude' => 'float',
		'longitude' => 'float',
		'coverage_radius_km' => 'float',
		'available_online' => 'bool',
		'available_walk_in' => 'bool',
		'available_home_service' => 'bool',
		'priority' => 'int',
		'is_active' => 'bool'
	];

	protected $fillable = [
		'tenant_id',
		'professional_id',
		'zone_type',
		'zone_name',
		'address',
		'province',
		'canton',
		'district',
		'latitude',
		'longitude',
		'coverage_areas',
		'coverage_radius_km',
		'available_online',
		'available_walk_in',
		'available_home_service',
		'business_hours',
		'priority',
		'is_active'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'professional_id');
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}
}
