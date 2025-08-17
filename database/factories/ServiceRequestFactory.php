<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ServiceRequest>
 */
class ServiceRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_number' => 'DMK' . fake()->dateTime()->format('Ymd') . fake()->numberBetween(1000, 9999),
            'type' => fake()->randomElement(['edukasi', 'rekomendasi', 'konsultasi', 'pengaduan']),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'organization' => fake()->optional()->company(),
            'description' => fake()->paragraph(3),
            'status' => fake()->randomElement(['baru', 'diproses', 'diverifikasi', 'selesai']),
        ];
    }
}