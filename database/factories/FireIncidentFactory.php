<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FireIncident>
 */
class FireIncidentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $locations = [
            'Jl. Diponegoro No. 15, Bungku',
            'Kompleks Ruko Morowali, Blok A',
            'Perumahan Griya Asri, Kolonodale',
            'Jl. Ahmad Yani, Lembo',
            'Kawasan Industri Morowali',
            'Desa Tanjung Api, Kecamatan Bungku Tengah',
        ];

        $causes = [
            'Korsleting listrik',
            'Kompor gas bocor',
            'Rokok yang tidak dipadamkan',
            'Sambaran petir',
            'Pembakaran sampah',
            'Tidak diketahui',
        ];

        $districts = [
            'Bungku Tengah',
            'Bungku Selatan',
            'Menui Kepulauan',
            'Lembo',
            'Bumi Raya',
        ];

        $severity = fake()->randomElement(['ringan', 'sedang', 'berat', 'parah']);
        
        return [
            'incident_number' => 'KB' . fake()->dateTimeBetween('-1 year')->format('Ymd') . fake()->numberBetween(1000, 9999),
            'incident_date' => fake()->dateTimeBetween('-90 days', 'now'),
            'location' => fake()->randomElement($locations),
            'district' => fake()->randomElement($districts),
            'cause' => fake()->randomElement($causes),
            'severity' => $severity,
            'response_time_minutes' => fake()->numberBetween(5, 45),
            'estimated_damage' => $severity === 'parah' ? fake()->numberBetween(100000000, 500000000) :
                                ($severity === 'berat' ? fake()->numberBetween(50000000, 200000000) :
                                ($severity === 'sedang' ? fake()->numberBetween(10000000, 50000000) :
                                fake()->numberBetween(1000000, 10000000))),
            'casualties' => $severity === 'parah' ? fake()->numberBetween(0, 3) : ($severity === 'berat' ? fake()->numberBetween(0, 1) : 0),
            'injured' => $severity === 'parah' ? fake()->numberBetween(0, 8) : 
                        ($severity === 'berat' ? fake()->numberBetween(0, 5) : 
                        ($severity === 'sedang' ? fake()->numberBetween(0, 2) : 0)),
            'description' => fake()->paragraph(3),
            'units_deployed' => [
                'fire_trucks' => fake()->numberBetween(1, 4),
                'personnel' => fake()->numberBetween(4, 20),
                'equipment' => fake()->randomElements(['Water Tank', 'Ladder', 'Rescue Equipment', 'Medical Kit'], random_int(2, 4))
            ],
            'status' => fake()->randomElement(['ongoing', 'controlled', 'resolved']),
        ];
    }
}