<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['member_id', 'uid', 'status', 'issued_at', 'issued_by'])]
class MembershipCard extends Model
{
    use HasFactory;

    public const STATUS_LOST = 0;
    public const STATUS_ACTIVE = 1;

    protected function casts(): array
    {
        return [
            'status' => 'integer',
            'issued_at' => 'datetime',
        ];
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function issuedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }
}