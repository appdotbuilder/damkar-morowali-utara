<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FireStation>
 */
class FireStationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Pos Pemadam Kebakaran Bungku Pusat',
                'Pos Pemadam Kebakaran Kolonodale',
                'Pos Pemadam Kebakaran Lembo',
                'Pos Pemadam Kebakaran Tanjung Api',
                'Pos Pemadam Kebakaran Bumi Raya',
            ]),
            'address' => fake()->address(),
            'district' => fake()->randomElement(['Bungku Tengah', 'Bungku Selatan', 'Menui Kepulauan', 'Lembo', 'Bumi Raya']),
            'phone' => fake()->phoneNumber(),
            'latitude' => fake()->latitude(-3.0, -1.0),
            'longitude' => fake()->longitude(121.0, 123.0),
            'equipment' => [
                'fire_trucks' => fake()->numberBetween(1, 3),
                'water_capacity' => fake()->numberBetween(2000, 8000) . ' liters',
                'ladder_height' => fake()->numberBetween(20, 50) . ' meters',
                'rescue_equipment' => fake()->randomElements(['Chainsaw', 'Hydraulic Cutter', 'Life Support', 'Breathing Apparatus'], random_int(2, 4))
            ],
            'personnel_count' => fake()->numberBetween(8, 25),
            'status' => fake()->randomElement(['active', 'maintenance', 'inactive']),
        ];
    }
}