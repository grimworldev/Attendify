<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Super Admin',
                'slug' => 'superadmin',
                'description' => 'Full access to all parts of the system.',
                'status' => 1,
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Manages users, roles, and gym membership records.',
                'status' => 1,
            ],
            [
                'name' => 'Teller',
                'slug' => 'teller',
                'description' => 'Handles front-desk transactions and check-ins.',
                'status' => 1,
            ],
            [
                'name' => 'Cashier',
                'slug' => 'cashier',
                'description' => 'Handles payments and billing.',
                'status' => 1,
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                $role,
            );
        }
    }
}