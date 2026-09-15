<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('membership_payments', function (Blueprint $table) {
            $table->id();

            // Human-readable receipt/log number, e.g. PAY-001-2026.
            // Auto-generated in the model, resets sequence each calendar year.
            $table->string('transaction_no', 20)->unique();

            $table->foreignId('membership_detail_id')
                ->constrained()
                ->cascadeOnDelete();

            // 0 = cash, 1 = gcash, 2 = bank_transfer, 3 = card
            $table->tinyInteger('payment_method')->default(0);

            // What was actually applied toward the balance.
            $table->decimal('amount_paid', 10, 2);

            // Cash-drawer trail — only meaningful when payment_method = cash.
            $table->decimal('amount_tendered', 10, 2)->nullable();
            $table->decimal('change', 10, 2)->nullable();

            // For non-cash: GCash ref no., bank transfer slip no., card auth code, etc.
            $table->string('reference_no')->nullable();

            // Which staff member took this specific payment (audit trail).
            $table->foreignId('processed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('paid_at')->useCurrent();
            $table->text('notes')->nullable();

            $table->timestamps();

            // Speeds up "find all payments for this membership transaction, in order"
            $table->index(['membership_detail_id', 'paid_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_payments');
    }
};