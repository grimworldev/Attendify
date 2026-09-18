<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

#[Fillable(['first_name', 'last_name', 'email', 'phone_number', 'gender', 'birthdate', 'address', 'status', 'registered_by'])]
class Member extends Model
{
    use HasFactory, HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected function casts(): array
    {
        return [
            'birthdate' => 'date',
            'status' => 'integer',
        ];
    }

    protected $appends = ['name'];

    protected function name(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn() => trim("{$this->first_name} {$this->last_name}"),
        );
    }

    /**
     * Staff member who registered this member.
     */
    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by');
    }

    /**
     * Full membership transaction history (every join + renewal), oldest first.
     */
    public function membershipDetails(): HasMany
    {
        return $this->hasMany(MembershipDetail::class)->oldest('start_date');
    }

    /**
     * The single most recent membership record, derived by date rather than
     * a stored flag — always correct even if renewals are inserted out of order.
     */
    public function currentMembership(): HasOne
    {
        return $this->hasOne(MembershipDetail::class)->latestOfMany('start_date');
    }

    /**
     * Whether this member's current membership is valid right now:
     * not manually cancelled/suspended AND not past its end date.
     */
    public function hasActiveMembership(): bool
    {
        $current = $this->currentMembership;

        if (!$current) {
            return false;
        }

        return $current->status === 1
            && Carbon::parse($current->end_date)->isFuture();
    }

    /**
     * Full RFID card history for this member (a card can be lost and
     * a replacement issued, so this can have more than one row).
     */
    public function membershipCards(): HasMany
    {
        return $this->hasMany(MembershipCard::class)->latest();
    }

    /**
     * The card currently in active use, derived by status rather than
     * a separate flag elsewhere — if the active one is marked lost,
     * this naturally returns null until a replacement is issued.
     */
    public function activeMembershipCard(): HasOne
    {
        return $this->hasOne(MembershipCard::class)
            ->ofMany(
                ['id' => 'max'],
                fn($query) => $query->where('status', MembershipCard::STATUS_ACTIVE),
            );
    }
}