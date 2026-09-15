<?php

namespace App\Policies;

use App\Models\MembershipDetail;
use App\Models\User;

class MembershipDetailPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isSuperAdmin() ? true : null;
    }

    /**
     * Correcting an existing record (wrong date, wrong plan, status
     * override) — same front-desk roles that can create one in the
     * first place. Adjust if corrections should be more restricted
     * than initial data entry.
     */
    public function update(User $user, MembershipDetail $membershipDetail): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'registrar']);
    }

    /**
     * Deleting destroys the payment audit trail (cascade), so this is
     * superadmin-only via before() — everyone else is denied.
     */
    public function delete(User $user, MembershipDetail $membershipDetail): bool
    {
        return false;
    }
}