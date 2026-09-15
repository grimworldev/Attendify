<?php

namespace App\Policies;

use App\Models\MembershipType;
use App\Models\User;

class MembershipTypePolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isSuperAdmin() ? true : null;
    }

    /**
     * Everyone with system access can view membership types
     * (needed as reference data when registering/renewing members).
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'registrar']);
    }

    public function view(User $user, MembershipType $membershipType): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'registrar']);
    }

    /**
     * Only Admin manages the actual plan configuration.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, MembershipType $membershipType): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, MembershipType $membershipType): bool
    {
        return false;
    }
}