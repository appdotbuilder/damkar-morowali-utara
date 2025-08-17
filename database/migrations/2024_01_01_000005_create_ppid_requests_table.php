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
        Schema::create('ppid_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number')->unique();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->text('address');
            $table->string('identity_type')->comment('KTP/SIM/Passport');
            $table->string('identity_number');
            $table->text('information_requested');
            $table->text('purpose');
            $table->string('identity_document')->nullable()->comment('Uploaded identity file');
            $table->enum('status', ['submitted', 'processing', 'approved', 'rejected', 'completed'])->default('submitted');
            $table->text('response')->nullable();
            $table->json('response_documents')->nullable();
            $table->datetime('responded_at')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users');
            $table->timestamps();
            
            // Indexes
            $table->index('request_number');
            $table->index('status');
            $table->index('email');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppid_requests');
    }
};