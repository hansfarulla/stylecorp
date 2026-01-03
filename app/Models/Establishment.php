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
 * Class Establishment
 * 
 * @property int $id
 * @property string|null $tenant_id
 * @property int $owner_id
 * @property string $name
 * @property string $slug
 * @property string|null $business_name
 * @property string|null $tax_id
 * @property string $type
 * @property string|null $email
 * @property string $phone
 * @property string|null $whatsapp
 * @property string|null $website
 * @property string $address
 * @property string $province
 * @property string $canton
 * @property string $district
 * @property float|null $latitude
 * @property float|null $longitude
 * @property string|null $logo
 * @property string|null $gallery
 * @property string|null $cover_image
 * @property string|null $corporate_colors
 * @property string|null $subdomain
 * @property string|null $business_hours
 * @property bool $accepts_walk_ins
 * @property bool $offers_home_service
 * @property string|null $home_service_zones
 * @property int $min_booking_hours
 * @property string|null $cancellation_policy
 * @property int $cancellation_hours
 * @property float $cancellation_fee
 * @property float $no_show_fee
 * @property string $payment_flow
 * @property string|null $payment_methods
 * @property string|null $notification_settings
 * @property string|null $supported_languages
 * @property string $status
 * @property bool $is_verified
 * @property Carbon|null $verified_at
 * @property float $rating
 * @property int $total_reviews
 * @property int $total_bookings
 * @property string|null $certifications
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property User $user
 * @property Tenant|null $tenant
 * @property Collection|Appointment[] $appointments
 * @property Collection|EstablishmentExpense[] $establishment_expenses
 * @property Collection|User[] $users
 * @property Collection|Favorite[] $favorites
 * @property Collection|LoyaltyPoint[] $loyalty_points
 * @property Collection|ProfessionalExpense[] $professional_expenses
 * @property Collection|Review[] $reviews
 * @property Collection|Service[] $services
 * @property Collection|Transaction[] $transactions
 *
 * @package App\Models
 */
class Establishment extends Model
{
	use SoftDeletes;
	use BelongsToTenant;
	protected $table = 'establishments';

	protected $casts = [
		'owner_id' => 'int',
		'latitude' => 'float',
		'longitude' => 'float',
		'accepts_walk_ins' => 'bool',
		'offers_home_service' => 'bool',
		'min_booking_hours' => 'int',
		'cancellation_hours' => 'int',
		'cancellation_fee' => 'float',
		'no_show_fee' => 'float',
		'is_verified' => 'bool',
		'verified_at' => 'datetime',
		'rating' => 'float',
		'total_reviews' => 'int',
		'total_bookings' => 'int',
		'supported_languages' => 'array',
		'gallery' => 'array',
		'corporate_colors' => 'array',
		'business_hours' => 'array',
		'home_service_zones' => 'array',
		'payment_methods' => 'array',
		'notification_settings' => 'array',
		'certifications' => 'array'
	];

	protected $attributes = [
		'supported_languages' => '["es"]',
		'accepts_walk_ins' => true,
		'offers_home_service' => false,
		'min_booking_hours' => 2,
		'cancellation_hours' => 24,
		'cancellation_fee' => 0,
		'no_show_fee' => 0,
		'payment_flow' => 'centralized',
		'status' => 'pending',
		'is_verified' => false,
		'rating' => 0,
		'total_reviews' => 0,
		'total_bookings' => 0
	];

	protected $fillable = [
		'tenant_id',
		'owner_id',
		'manager_id',
		'name',
		'slug',
		'business_name',
		'tax_id',
		'type',
		'email',
		'phone',
		'whatsapp',
		'website',
		'address',
		'province',
		'canton',
		'district',
		'latitude',
		'longitude',
		'logo',
		'gallery',
		'cover_image',
		'corporate_colors',
		'subdomain',
		'business_hours',
		'accepts_walk_ins',
		'offers_home_service',
		'home_service_zones',
		'min_booking_hours',
		'cancellation_policy',
		'cancellation_hours',
		'cancellation_fee',
		'no_show_fee',
		'payment_flow',
		'payment_methods',
		'notification_settings',
		'supported_languages',
		'status',
		'is_verified',
		'verified_at',
		'rating',
		'total_reviews',
		'total_bookings',
		'certifications'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'owner_id');
	}

	public function owner()
	{
		return $this->belongsTo(User::class, 'owner_id');
	}

	public function manager()
	{
		return $this->belongsTo(User::class, 'manager_id');
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}

	public function appointments()
	{
		return $this->hasMany(Appointment::class);
	}

	public function establishment_expenses()
	{
		return $this->hasMany(EstablishmentExpense::class);
	}

	public function users()
	{
		return $this->belongsToMany(User::class)
					->withPivot('id', 'role', 'commission_model', 'commission_percentage', 'commission_tiers', 'fixed_amount_per_service', 'base_salary', 'booth_rental_fee', 'tips_included_in_commission', 'payment_period', 'status', 'auto_accept_appointments', 'start_date', 'end_date', 'agreement_terms', 'agreement_signed_at')
					->withTimestamps();
	}

	public function favorites()
	{
		return $this->hasMany(Favorite::class);
	}

	public function loyalty_points()
	{
		return $this->hasMany(LoyaltyPoint::class);
	}

	public function professional_expenses()
	{
		return $this->hasMany(ProfessionalExpense::class);
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

	public function workstations()
	{
		return $this->hasMany(Workstation::class);
	}

	public function workstationOffers()
	{
		return $this->hasMany(WorkstationOffer::class);
	}
}
