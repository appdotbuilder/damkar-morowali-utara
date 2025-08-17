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
        Schema::create('fire_incidents', function (Blueprint $table) {
            $table->id();
            $table->string('incident_number')->unique();
            $table->datetime('incident_date');
            $table->string('location');
            $table->string('district')->nullable();
            $table->string('cause')->nullable();
            $table->enum('severity', ['ringan', 'sedang', 'berat', 'parah'])->default('ringan');
            $table->integer('response_time_minutes')->nullable()->comment('Response time in minutes');
            $table->decimal('estimated_damage', 15, 2)->nullable()->comment('Estimated damage in IDR');
            $table->integer('casualties')->default(0);
            $table->integer('injured')->default(0);
            $table->text('description')->nullable();
            $table->json('units_deployed')->nullable()->comment('Fire units and personnel deployed');
            $table->enum('status', ['ongoing', 'controlled', 'resolved'])->default('ongoing');
            $table->timestamps();
            
            // Indexes
            $table->index('incident_date');
            $table->index('location');
            $table->index('district');
            $table->index('cause');
            $table->index('severity');
            $table->index('status');
            $table->index(['incident_date', 'severity']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fire_incidents');
    }
};