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
 * Class Service
 * 
 * @property int $id
 * @property string|null $tenant_id
 * @property int|null $establishment_id
 * @property int|null $professional_id
 * @property string $name
 * @property string|null $description
 * @property string $slug
 * @property string $category
 * @property float $base_price
 * @property bool $price_varies_by_professional
 * @property string|null $professional_prices
 * @property int $duration_minutes
 * @property int $buffer_time_minutes
 * @property bool $available_online
 * @property bool $available_home_service
 * @property float $home_service_surcharge
 * @property string|null $independent_address
 * @property string|null $independent_province
 * @property string|null $independent_canton
 * @property string|null $independent_district
 * @property float|null $independent_latitude
 * @property float|null $independent_longitude
 * @property string|null $images
 * @property string|null $requirements
 * @property bool $is_active
 * @property bool $is_package
 * @property string|null $package_services
 * @property int $total_bookings
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Establishment|null $establishment
 * @property User|null $professional
 * @property Tenant|null $tenant
 * @property Collection|Appointment[] $appointments
 *
 * @package App\Models
 */
class Service extends Model
{
	use SoftDeletes;
	use BelongsToTenant;
	protected $table = 'services';

	protected $casts = [
		'establishment_id' => 'int',
		'professional_id' => 'int',
		'base_price' => 'float',
		'price_varies_by_professional' => 'bool',
		'duration_minutes' => 'int',
		'buffer_time_minutes' => 'int',
		'available_online' => 'bool',
		'available_home_service' => 'bool',
		'home_service_surcharge' => 'float',
		'home_service_radius_km' => 'float',
		'home_service_latitude' => 'float',
		'home_service_longitude' => 'float',
		'delivery_tiers' => 'array',
		'independent_latitude' => 'float',
		'independent_longitude' => 'float',
		'is_active' => 'bool',
		'is_package' => 'bool',
		'total_bookings' => 'int'
	];

	protected $fillable = [
		'tenant_id',
		'establishment_id',
		'professional_id',
		'name',
		'description',
		'slug',
		'category_id',
		'base_price',
		'price_varies_by_professional',
		'professional_prices',
		'duration_minutes',
		'buffer_time_minutes',
		'available_online',
		'available_home_service',
		'home_service_surcharge',
		'home_service_radius_km',
		'home_service_latitude',
		'home_service_longitude',
		'delivery_tiers',
		'independent_address',
		'independent_province',
		'independent_canton',
		'independent_district',
		'independent_latitude',
		'independent_longitude',
		'images',
		'requirements',
		'is_active',
		'is_package',
		'package_services',
		'total_bookings'
	];

	public function establishment()
	{
		return $this->belongsTo(Establishment::class);
	}

	public function category()
	{
		return $this->belongsTo(ServiceCategory::class, 'category_id');
	}

	public function professional()
	{
		return $this->belongsTo(User::class, 'professional_id');
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}

	public function appointments()
	{
		return $this->hasMany(Appointment::class);
	}

	public function professionals()
	{
		return $this->belongsToMany(User::class, 'service_user')
					->withPivot('custom_price', 'custom_duration_minutes')
					->withTimestamps();
	}
}
