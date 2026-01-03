<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Traits\BelongsToTenant;

class Permission extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'name',
        'label',
        'description',
        'category',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Usuarios que tienen este permiso
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'permission_user')
            ->withPivot(['establishment_id', 'granted', 'granted_by'])
            ->withTimestamps();
    }

    /**
     * Obtener permisos agrupados por categoría
     */
    public static function grouped(): array
    {
        return static::orderBy('category')
            ->orderBy('order')
            ->get()
            ->groupBy('category')
            ->toArray();
    }
}
