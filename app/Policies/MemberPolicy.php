<?php

namespace App\Policies;

use App\Models\Member;
use App\Models\User;

class MemberPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isSuperAdmin() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'registrar']);
    }

    public function view(User $user, Member $member): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'registrar']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'registrar']);
    }

    public function update(User $user, Member $member): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'registrar']);
    }

    public function delete(User $user, Member $member): bool
    {
        return false;
    }
}