<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkstationOffer extends Model
{
    protected $fillable = [
        'establishment_id',
        'workstation_id',
        'title',
        'description',
        'employment_type',
        'commission_model',
        'commission_percentage',
        'base_salary',
        'booth_rental_fee',
        'schedule',
        'deadline',
        'status',
    ];

    protected $casts = [
        'schedule' => 'array',
        'deadline' => 'date',
        'commission_percentage' => 'decimal:2',
        'base_salary' => 'decimal:2',
        'booth_rental_fee' => 'decimal:2',
    ];

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }

    public function workstation(): BelongsTo
    {
        return $this->belongsTo(Workstation::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(StaffApplication::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where(function($q) {
                $q->whereNull('deadline')
                  ->orWhere('deadline', '>=', now());
            });
    }
}
