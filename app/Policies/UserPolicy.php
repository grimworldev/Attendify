<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Superadmin bypasses every check below automatically.
     */
    public function before(User $user, string $ability): ?bool
    {
        return $user->isSuperAdmin() ? true : null;
    }

    /**
     * Superadmin, Admin, Manager can view the users list and individual users.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager']);
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasAnyRole(['admin', 'manager']);
    }

    /**
     * Superadmin, Admin, Manager can register new users.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager']);
    }

    /**
     * Only Superadmin and Admin can edit existing users.
     */
    public function update(User $user, User $model): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Only Superadmin can delete users.
     */
    public function delete(User $user, User $model): bool
    {
        return false;
    }
}