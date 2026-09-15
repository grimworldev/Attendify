<?php

namespace App\Policies;

use App\Models\User;

class MembershipPaymentPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isSuperAdmin() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'registrar']);
    }
}