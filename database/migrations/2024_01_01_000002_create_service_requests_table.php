<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->enum('type', ['edukasi', 'rekomendasi', 'konsultasi', 'pengaduan']); 
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('organization')->nullable();
            $table->text('description');
            $table->json('attachments')->nullable();
            $table->enum('status', ['baru', 'diproses', 'diverifikasi', 'selesai', 'ditolak'])->default('baru');
            $table->text('notes')->nullable();
            $table->datetime('scheduled_at')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users');
            $table->timestamps();
            
            // Indexes
            $table->index('ticket_number');
            $table->index('type');
            $table->index('status');
            $table->index('email');
            $table->index(['type', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};