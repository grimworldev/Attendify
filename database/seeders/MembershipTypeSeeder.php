<?php

namespace Database\Seeders;

use App\Models\MembershipType;
use Illuminate\Database\Seeder;

class MembershipTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $membershipTypes = [
            [
                'name' => 'Silver',
                'slug' => 'silver',
                'description' => 'Basic gym membership with access to standard gym equipment and facilities during regular operating hours.',
                'duration_in_days' => 30,
                'price' => 800.00,
                'status' => 1,
            ],
            [
                'name' => 'Gold',
                'slug' => 'gold',
                'description' => 'Enhanced gym membership with full access to gym facilities, group fitness classes, and selected additional services.',
                'duration_in_days' => 30,
                'price' => 1200.00,
                'status' => 1,
            ],
            [
                'name' => 'Diamond',
                'slug' => 'diamond',
                'description' => 'Premium gym membership with full facility access, group fitness classes, priority services, and personal training sessions.',
                'duration_in_days' => 30,
                'price' => 1800.00,
                'status' => 1,
            ],
        ];

        foreach ($membershipTypes as $membershipType) {
            MembershipType::updateOrCreate(
                ['slug' => $membershipType['slug']],
                $membershipType
            );
        }
    }
}
