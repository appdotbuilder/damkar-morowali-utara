<?php

namespace Database\Seeders;

use App\Models\FireIncident;
use App\Models\FireStation;
use App\Models\NewsArticle;
use Illuminate\Database\Seeder;

class FireDepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create news articles
        NewsArticle::factory(15)->create();

        // Create fire stations
        FireStation::factory()->create([
            'name' => 'Kantor Dinas Pemadam Kebakaran Morowali Utara',
            'address' => 'Jl. Pemadam No. 1, Kolonodale, Morowali Utara',
            'district' => 'Bungku Tengah',
            'phone' => '(0462) 123-456',
            'status' => 'active',
            'personnel_count' => 35,
        ]);

        FireStation::factory(4)->create();

        // Create fire incidents
        FireIncident::factory(20)->create();

        // Create some recent incidents for the homepage
        FireIncident::factory(3)->create([
            'incident_date' => now()->subDays(random_int(1, 7)),
            'status' => 'resolved',
        ]);
    }
}