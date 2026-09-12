<?php

namespace Database\Seeders;

use App\Models\College;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with the demo accounts referenced by
     * the frontend's login "Quick Demo Logins" buttons, so they work against
     * real authentication instead of the old mocked flow.
     */
    public function run(): void
    {
        $apex = College::firstOrCreate(
            ['short_code' => 'APEX'],
            [
                'name' => 'Apex Institute of Technology & Research',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
                'tier' => 'Academic Enterprise',
                'placement_rate' => 92.50,
            ]
        );

        User::updateOrCreate(
            ['email' => 'aryan@mellow.ai'],
            [
                'name' => 'Aryan Mehta',
                'handle' => 'aryan_root',
                'password' => Hash::make('super_secure_key_2026'),
                'role' => User::ROLE_SUPERADMIN,
            ]
        );

        User::updateOrCreate(
            ['email' => 'priya@mellow.ai'],
            [
                'name' => 'Priya Sundaram',
                'handle' => 'priya_ops',
                'password' => Hash::make('mellow_staff_ops_99'),
                'role' => User::ROLE_ADMIN_INTERNAL,
            ]
        );

        User::updateOrCreate(
            ['email' => 'tpo@apex.edu.in'],
            [
                'name' => 'Dr. Rajeshwar Sharma',
                'handle' => 'rajeshwar_tpo',
                'password' => Hash::make('apex_tpo_placement_2026'),
                'role' => User::ROLE_ADMIN_TPO,
                'college_id' => $apex->id,
            ]
        );

        User::updateOrCreate(
            ['email' => 'alex.chen@student.apex.edu'],
            [
                'name' => 'Alex Chen',
                'handle' => 'alex_coder',
                'password' => Hash::make('alex_coder_codeforge'),
                'role' => User::ROLE_USER,
                'college_id' => $apex->id,
            ]
        );
    }
}
