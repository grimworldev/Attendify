<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'description', 'duration_in_days', 'price', 'status'])]
class MembershipType extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'status' => 'integer',
        ];
    }

    public function membershipDetails(): HasMany
    {
        return $this->hasMany(MembershipDetail::class);
    }
}