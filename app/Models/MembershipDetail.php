<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

#[Fillable([
    'member_id',
    'membership_type_id',
    'type',
    'start_date',
    'end_date',
    'amount_paid',
    'status',
    'processed_by',
    'notes',
])]
class MembershipDetail extends Model
{
    use HasFactory;

    /**
     * Transaction type constants — 0 = new signup, 1 = renewal.
     */
    public const TYPE_NEW = 0;
    public const TYPE_RENEWAL = 1;

    /**
     * Status constants for the manual override state.
     */
    public const STATUS_CANCELLED = 0;
    public const STATUS_ACTIVE = 1;
    public const STATUS_SUSPENDED = 2;

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'amount_paid' => 'decimal:2',
            'type' => 'integer',
            'status' => 'integer',
        ];
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function membershipType(): BelongsTo
    {
        return $this->belongsTo(MembershipType::class);
    }

    /**
     * Staff member who processed this transaction.
     */
    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Whether this specific record is currently within its date range
     * (independent of whether it's the member's most recent record).
     */
    public function isWithinDateRange(): bool
    {
        return Carbon::parse($this->end_date)->isFuture();
    }
}