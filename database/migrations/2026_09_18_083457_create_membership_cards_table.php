<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('membership_cards', function (Blueprint $table) {
            $table->id();

            // Nullable so a batch of physical cards can be pre-registered
            // into inventory before being handed out and assigned.
            $table->foreignId('member_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // The actual value read off the RFID chip by the scanner.
            $table->string('uid')->unique();

            // 0 = lost/inactive, 1 = active
            $table->tinyInteger('status')->default(1);

            $table->timestamp('issued_at')->nullable();

            // Which staff member handed out / registered this card.
            $table->foreignId('issued_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->index(['member_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_cards');
    }
};