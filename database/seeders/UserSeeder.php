<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadminRole = Role::where('slug', 'superadmin')->first();

        User::updateOrCreate(
            ['email' => 'grimworld.dev@gmail.com'],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'username' => 'grimworld',
                'gender' => 'Others',
                'password' => Hash::make('123'),
                'role_id' => $superadminRole?->id,
                'email_verified_at' => now(),
            ],
        );
    }
}