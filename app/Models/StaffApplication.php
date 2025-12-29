<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffApplication extends Model
{
    protected $fillable = [
        'workstation_offer_id',
        'user_id',
        'applicant_name',
        'applicant_email',
        'applicant_phone',
        'message',
        'portfolio_url',
        'experience',
        'status',
        'rejection_reason',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'experience' => 'array',
        'reviewed_at' => 'datetime',
    ];

    public function offer(): BelongsTo
    {
        return $this->belongsTo(WorkstationOffer::class, 'workstation_offer_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
