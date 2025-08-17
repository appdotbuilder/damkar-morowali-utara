<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NewsArticle>
 */
class NewsArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['berita', 'edukasi', 'siaran-pers', 'kegiatan'];
        $titles = [
            'Tim Damkar Morowali Utara Berhasil Padamkan Kebakaran Rumah di Kelurahan Bungku',
            'Simulasi Pemadaman Kebakaran di SMK Negeri 1 Morowali Utara',
            'Sosialisasi Penggunaan APAR untuk Perusahaan Tambang',
            'Peringatan Dini: Musim Kemarau Meningkatkan Risiko Kebakaran Hutan',
            'Damkar Lakukan Inspeksi Rutin Fasilitas Umum di Pusat Kota',
            'Workshop Keselamatan Kebakaran untuk Aparatur Pemerintah Daerah',
        ];

        return [
            'title' => fake()->randomElement($titles),
            'summary' => fake()->paragraph(2),
            'content' => fake()->paragraphs(8, true),
            'author' => fake()->randomElement(['Humas Damkar', 'Tim Redaksi', 'Kepala Seksi Pencegahan']),
            'category' => fake()->randomElement($categories),
            'tags' => fake()->randomElements(['kebakaran', 'pencegahan', 'edukasi', 'simulasi', 'keselamatan', 'sosialisasi'], random_int(2, 4)),
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}