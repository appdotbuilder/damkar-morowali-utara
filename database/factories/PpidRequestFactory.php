<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PpidRequest>
 */
class PpidRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'request_number' => 'PPID' . fake()->dateTime()->format('Ymd') . fake()->numberBetween(1000, 9999),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'identity_type' => fake()->randomElement(['KTP', 'SIM', 'Passport']),
            'identity_number' => fake()->numerify('################'),
            'information_requested' => fake()->paragraph(2),
            'purpose' => fake()->sentence(),
            'status' => fake()->randomElement(['submitted', 'processing', 'approved', 'completed']),
        ];
    }
}