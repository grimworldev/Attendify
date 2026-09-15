<?php

namespace App\Http\Requests;

use App\Models\MembershipDetail;
use App\Models\MembershipPayment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MembershipDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // authorization handled in the controller via $this->authorize()
    }

    public function rules(): array
    {
        if ($this->isMethod('patch') || $this->isMethod('put')) {
            return $this->updateRules();
        }

        return $this->storeRules();
    }

    /**
     * POST /members/{member}/membership-details
     * Creates a new membership transaction AND its first payment together.
     */
    protected function storeRules(): array
    {
        return [
            // --- membership_details fields ---
            'membership_type_id' => ['required', 'exists:membership_types,id'],
            'type' => [
                'required',
                Rule::in([
                    MembershipDetail::TYPE_NEW,
                    MembershipDetail::TYPE_RENEWAL,
                ])
            ],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'notes' => ['nullable', 'string', 'max:1000'],

            // --- initial membership_payments fields ---
            'payment_method' => [
                'required',
                Rule::in([
                    MembershipPayment::METHOD_CASH,
                    MembershipPayment::METHOD_GCASH,
                    MembershipPayment::METHOD_BANK_TRANSFER,
                    MembershipPayment::METHOD_CARD,
                ])
            ],
            'amount_paid' => ['required', 'numeric', 'min:0.01'],
            'amount_tendered' => [
                'nullable',
                'numeric',
                'min:0',
                Rule::requiredIf(
                    fn() => (int) $this->input('payment_method') === MembershipPayment::METHOD_CASH,
                ),
            ],
            'reference_no' => [
                'nullable',
                'string',
                'max:255',
                Rule::requiredIf(
                    fn() => (int) $this->input('payment_method') !== MembershipPayment::METHOD_CASH,
                ),
            ],
            'payment_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * PATCH /membership-details/{membershipDetail}
     * Corrections only — dates, plan, manual status override, notes.
     * Deliberately excludes amount_paid/payment fields: fixing a payment
     * amount goes through a new MembershipPayment record instead, so the
     * payment audit trail is never edited after the fact.
     */
    protected function updateRules(): array
    {
        return [
            'membership_type_id' => ['sometimes', 'exists:membership_types,id'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after:start_date'],
            'status' => [
                'sometimes',
                'integer',
                Rule::in([
                    MembershipDetail::STATUS_CANCELLED,
                    MembershipDetail::STATUS_ACTIVE,
                    MembershipDetail::STATUS_SUSPENDED,
                ])
            ],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}