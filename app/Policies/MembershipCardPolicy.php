<?php

namespace App\Policies;

use App\Models\Member;
use App\Models\User;

class MembershipCardPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isSuperAdmin() ? true : null;
    }

    /**
     * Viewing the full list of issued cards.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'registrar']);
    }

    /**
     * Assigning a card, marking one lost, or issuing a replacement —
     * same front-desk roles as everything else on a member's profile.
     */
    public function manageCard(User $user, Member $member): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'registrar']);
    }
}