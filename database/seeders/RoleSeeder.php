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
                'description' => 'Has full access to the gym management system, including users, roles, memberships, payments, RFID access, and system settings.',
                'status' => 1,
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Manages gym members, memberships, user accounts, RFID cards, and gym records.',
                'status' => 1,
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'description' => 'Oversees daily gym operations, monitors member activity, check-ins, and RFID access records.',
                'status' => 1,
            ],
            [
                'name' => 'Registrar',
                'slug' => 'registrar',
                'description' => 'Registers gym members, manages membership details, processes payments, and assigns or manages RFID membership cards.',
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