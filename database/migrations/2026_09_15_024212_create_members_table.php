<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();

            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('phone_number')->nullable();
            $table->enum('gender', ['Male', 'Female', 'Others'])->nullable();
            $table->date('birthdate')->nullable();
            $table->text('address')->nullable();

            // Account-level status: is this member record active or archived/banned.
            // Separate from membership validity, which lives in membership_details.
            $table->tinyInteger('status')->default(1); // 0 = inactive, 1 = active

            // Who registered this member (staff accountability).
            $table->foreignId('registered_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};