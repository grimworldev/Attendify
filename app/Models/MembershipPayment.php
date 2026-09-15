<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'membership_detail_id',
    'payment_method',
    'amount_paid',
    'amount_tendered',
    'change',
    'reference_no',
    'processed_by',
    'paid_at',
    'notes',
])]
class MembershipPayment extends Model
{
    use HasFactory;

    /**
     * Payment method constants.
     */
    public const METHOD_CASH = 0;
    public const METHOD_GCASH = 1;
    public const METHOD_BANK_TRANSFER = 2;
    public const METHOD_CARD = 3;

    protected function casts(): array
    {
        return [
            'payment_method' => 'integer',
            'amount_paid' => 'decimal:2',
            'amount_tendered' => 'decimal:2',
            'change' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (MembershipPayment $payment) {
            if (empty($payment->transaction_no)) {
                $payment->transaction_no = static::generateTransactionNo();
            }
        });
    }

    /**
     * Builds the next sequential transaction number for the current year,
     * e.g. PAY-001-2026, PAY-002-2026 ... resetting to 001 each new year.
     *
     * Relies on being called from inside an existing DB::transaction() (the
     * controller already wraps membership creation in one) — lockForUpdate()
     * only serializes concurrent requests within a transaction, so calling
     * this outside one can still race and produce duplicate numbers.
     */
    public static function generateTransactionNo(string $prefix = 'PAY'): string
    {
        $year = now()->year;

        $lastNumber = static::query()
            ->where('transaction_no', 'like', "{$prefix}-%-{$year}")
            ->lockForUpdate()
            ->orderByDesc('id')
            ->value('transaction_no');

        $nextSequence = 1;

        if ($lastNumber) {
            // transaction_no shape: PREFIX-SEQUENCE-YEAR
            $sequence = (int) explode('-', $lastNumber)[1];
            $nextSequence = $sequence + 1;
        }

        return sprintf('%s-%03d-%d', $prefix, $nextSequence, $year);
    }

    /**
     * The membership transaction (signup or renewal) this payment was applied to.
     */
    public function membershipDetail(): BelongsTo
    {
        return $this->belongsTo(MembershipDetail::class);
    }

    /**
     * Staff member who took this specific payment.
     */
    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Human-readable label for the payment method, e.g. for receipts/dashboards.
     */
    public function methodLabel(): string
    {
        return match ($this->payment_method) {
            self::METHOD_CASH => 'Cash',
            self::METHOD_GCASH => 'GCash',
            self::METHOD_BANK_TRANSFER => 'Bank Transfer',
            self::METHOD_CARD => 'Card',
            default => 'Unknown',
        };
    }
}