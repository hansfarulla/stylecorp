<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class User
 * 
 * @property int $id
 * @property string|null $tenant_id
 * @property string $name
 * @property string|null $username
 * @property string $email
 * @property string|null $phone
 * @property Carbon|null $phone_verified_at
 * @property string|null $avatar
 * @property string $role
 * @property string $type
 * @property string|null $bio
 * @property int|null $years_experience
 * @property string|null $specialties
 * @property string|null $certifications
 * @property bool $is_verified
 * @property string|null $google_id
 * @property string|null $facebook_id
 * @property string $locale
 * @property string $timezone
 * @property bool $notifications_enabled
 * @property string $status
 * @property Carbon|null $last_login_at
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Appointment[] $appointments
 * @property Collection|Establishment[] $establishments
 * @property Collection|Favorite[] $favorites
 * @property Collection|Follow[] $follows
 * @property Collection|LoyaltyPointTransaction[] $loyalty_point_transactions
 * @property Collection|LoyaltyPoint[] $loyalty_points
 * @property Collection|Notification[] $notifications
 * @property Collection|ProfessionalExpense[] $professional_expenses
 * @property Collection|ProfessionalServiceZone[] $professional_service_zones
 * @property Collection|Review[] $reviews
 * @property Collection|Service[] $services
 * @property Collection|Transaction[] $transactions
 *
 * @package App\Models
 */
class User extends Authenticatable
{
	use BelongsToTenant, HasFactory, Notifiable;
	protected $table = 'users';

	protected $casts = [
		'phone_verified_at' => 'datetime',
		'years_experience' => 'int',
		'is_verified' => 'bool',
		'notifications_enabled' => 'bool',
		'last_login_at' => 'datetime',
		'email_verified_at' => 'datetime',
		'two_factor_confirmed_at' => 'datetime'
	];

	protected $hidden = [
		'password',
		'two_factor_secret',
		'remember_token'
	];

	protected $fillable = [
		'tenant_id',
		'name',
		'username',
		'email',
		'phone',
		'phone_verified_at',
		'avatar',
		'role',
		'type',
		'bio',
		'years_experience',
		'specialties',
		'certifications',
		'is_verified',
		'google_id',
		'facebook_id',
		'locale',
		'timezone',
		'notifications_enabled',
		'status',
		'active_establishment_id',
		'last_login_at',
		'email_verified_at',
		'password',
		'two_factor_secret',
		'two_factor_recovery_codes',
		'two_factor_confirmed_at',
		'remember_token'
	];

	public function appointments()
	{
		return $this->hasMany(Appointment::class, 'professional_id');
	}

	public function ownedEstablishments()
	{
		return $this->hasMany(Establishment::class, 'owner_id');
	}

	public function establishments()
	{
		return $this->belongsToMany(Establishment::class)
					->withPivot('id', 'role', 'commission_model', 'commission_percentage', 'commission_tiers', 'fixed_amount_per_service', 'base_salary', 'booth_rental_fee', 'tips_included_in_commission', 'payment_period', 'status', 'auto_accept_appointments', 'start_date', 'end_date', 'agreement_terms', 'agreement_signed_at')
					->withTimestamps();
	}

	public function activeEstablishment()
	{
		return $this->belongsTo(Establishment::class, 'active_establishment_id');
	}

	public function favorites()
	{
		return $this->hasMany(Favorite::class);
	}

	public function follows()
	{
		return $this->hasMany(Follow::class, 'professional_id');
	}

	public function loyalty_point_transactions()
	{
		return $this->hasMany(LoyaltyPointTransaction::class);
	}

	public function loyalty_points()
	{
		return $this->hasMany(LoyaltyPoint::class);
	}

	public function notifications()
	{
		return $this->hasMany(Notification::class);
	}

	public function professional_expenses()
	{
		return $this->hasMany(ProfessionalExpense::class, 'professional_id');
	}

	public function professional_service_zones()
	{
		return $this->hasMany(ProfessionalServiceZone::class, 'professional_id');
	}

	public function reviews()
	{
		return $this->hasMany(Review::class, 'responded_by');
	}

	public function services()
	{
		return $this->belongsToMany(Service::class, 'service_user')
					->withPivot('custom_price', 'custom_duration_minutes')
					->withTimestamps();
	}

	public function transactions()
	{
		return $this->hasMany(Transaction::class, 'professional_id');
	}

	public function workstations()
	{
		return $this->belongsToMany(Workstation::class, 'workstation_user')
			->withPivot(['start_time', 'end_time', 'days', 'notes'])
			->withTimestamps();
	}

	/**
	 * Permisos personalizados asignados al usuario
	 */
	public function permissions()
	{
		return $this->belongsToMany(Permission::class, 'permission_user')
			->withPivot(['establishment_id', 'granted', 'granted_by'])
			->withTimestamps();
	}

	/**
	 * Verificar si el usuario tiene un permiso específico
	 */
	public function hasPermission(string $permission, ?int $establishmentId = null): bool
	{
		// Super Admin tiene todos los permisos
		if ($this->role === 'super_admin') {
			return true;
		}

		// Owner tiene todos los permisos de su establecimiento
		if ($this->role === 'owner' && $establishmentId) {
			$ownsEstablishment = $this->establishments()
				->where('establishments.id', $establishmentId)
				->exists();
			
			if ($ownsEstablishment) {
				return true;
			}
		}

		// Verificar permisos por rol (de UserRole enum)
		$rolePermissions = \App\Enums\UserRole::from($this->role)->permissions();
		if (in_array('*', $rolePermissions) || in_array($permission, $rolePermissions)) {
			return true;
		}

		// Verificar permisos granulares asignados específicamente
		$query = $this->permissions()->where('name', $permission);
		
		if ($establishmentId) {
			$query->where('permission_user.establishment_id', $establishmentId);
		}
		
		$customPermission = $query->first();
		
		if ($customPermission) {
			return (bool) $customPermission->pivot->granted;
		}

		return false;
	}

	/**
	 * Verificar si tiene alguno de los permisos especificados
	 */
	public function hasAnyPermission(array $permissions, ?int $establishmentId = null): bool
	{
		foreach ($permissions as $permission) {
			if ($this->hasPermission($permission, $establishmentId)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Verificar si tiene todos los permisos especificados
	 */
	public function hasAllPermissions(array $permissions, ?int $establishmentId = null): bool
	{
		foreach ($permissions as $permission) {
			if (!$this->hasPermission($permission, $establishmentId)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Asignar un permiso granular al usuario
	 */
	public function grantPermission(string $permissionName, ?int $establishmentId = null, ?int $grantedBy = null): void
	{
		$permission = Permission::where('name', $permissionName)->firstOrFail();
		
		$this->permissions()->syncWithoutDetaching([
			$permission->id => [
				'establishment_id' => $establishmentId,
				'granted' => true,
				'granted_by' => $grantedBy,
			]
		]);
	}

	/**
	 * Revocar un permiso granular del usuario
	 */
	public function revokePermission(string $permissionName, ?int $establishmentId = null): void
	{
		$permission = Permission::where('name', $permissionName)->first();
		
		if (!$permission) {
			return;
		}

		if ($establishmentId) {
			$this->permissions()
				->wherePivot('establishment_id', $establishmentId)
				->detach($permission->id);
		} else {
			$this->permissions()->detach($permission->id);
		}
	}

	/**
	 * Obtener todos los permisos efectivos del usuario (rol + granulares)
	 */
	public function getAllPermissions(?int $establishmentId = null): array
	{
		// Permisos del rol
		$rolePermissions = \App\Enums\UserRole::from($this->role)->permissions();
		
		// Permisos granulares
		$query = $this->permissions()->where('permission_user.granted', true);
		
		if ($establishmentId) {
			$query->where('permission_user.establishment_id', $establishmentId);
		}
		
		$customPermissions = $query->pluck('name')->toArray();
		
		// Combinar ambos
		return array_unique(array_merge($rolePermissions, $customPermissions));
	}

	/**
	 * Update the user's last login timestamp
	 */
	public function updateLastLogin(): void
	{
		$this->update([
			'last_login_at' => now()
		]);
	}
}
