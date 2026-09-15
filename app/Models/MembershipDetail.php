<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

#[Fillable([
    'member_id',
    'membership_type_id',
    'type',
    'start_date',
    'end_date',
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
            'amount_payable' => 'decimal:2',
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
     * All payments applied toward this specific transaction, oldest first
     * (handles partial/installment payments).
     */
    public function payments(): HasMany
    {
        return $this->hasMany(MembershipPayment::class)->oldest('paid_at');
    }

    /**
     * Total actually received so far, derived from membership_payments.
     * NOTE: accesses $this->payments — eager-load it (with('payments')) when
     * listing many records to avoid N+1 queries.
     */
    protected function amountPaid(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->payments->sum('amount_paid'),
        );
    }

    /**
     * What's still owed on this transaction.
     */
    protected function balanceDue(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->amount_payable - $this->amount_paid,
        );
    }

    /**
     * Whether this transaction has been paid in full.
     */
    protected function isFullyPaid(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->balance_due <= 0,
        );
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