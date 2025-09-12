<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Enums\UserRole;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [];
        foreach(UserRole::cases() as $role) {
            $roles[] = [
                'name' => $role,
                'guard_name' => 'web',
            ];
        };

        Role::insert($roles);
    }
}
