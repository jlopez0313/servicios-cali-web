<?php

namespace App\Traits;

use App\Enums\UserRole;

trait HasRole
{
    public function hasRole(UserRole | string $role): bool
    {
        $userRoleValue = $this->role instanceof UserRole ? $this->role->value : $this->role;

        if (is_string($role)) {
            return $userRoleValue === $role;
        }
        
        return $userRoleValue === $role->value;
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(UserRole::ADMIN);
    }

    public function isComercio(): bool
    {
        return $this->hasRole(UserRole::COMERCIO);
    }

    public function assignRole(UserRole $role): void
    {
        $this->update(['role' => $role]);
    }
}