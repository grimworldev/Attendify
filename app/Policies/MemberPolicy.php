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

    /**
     * Record a new membership signup/renewal and its payment for this member.
     * Same roles as editing member details — Registrar is the one actually
     * handling these front-desk transactions day to day.
     */
    public function manageMembership(User $user, Member $member): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'registrar']);
    }
}