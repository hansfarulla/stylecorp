<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Workstation extends Model
{
    protected $fillable = [
        'establishment_id',
        'name',
        'number',
        'description',
        'status',
        'assigned_user_id',
        'schedule',
    ];

    protected $casts = [
        'schedule' => 'array',
    ];

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    /**
     * Relación many-to-many con usuarios asignados con horarios específicos
     */
    public function assignedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'workstation_user')
            ->withPivot(['start_time', 'end_time', 'days', 'notes'])
            ->withTimestamps();
    }

    public function offers(): HasMany
    {
        return $this->hasMany(WorkstationOffer::class);
    }
}
