<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('membership_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->cascadeOnDelete();
            $table->foreignId('membership_type_id')->constrained()->restrictOnDelete();
            // 0 = new signup, 1 = renewal
            $table->tinyInteger('type')->default(0);
            $table->date('start_date');
            $table->date('end_date');
            // Manual override state: 0 = cancelled, 1 = active, 2 = suspended.
            // Whether it's expired by date is derived from end_date, not stored here.
            $table->tinyInteger('status')->default(1);
            // Which staff member processed this transaction (audit trail).
            $table->foreignId('processed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
            // Speeds up "find this member's history, ordered by start date"
            // and "find their current membership" queries.
            $table->index(['member_id', 'start_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_details');
    }
};