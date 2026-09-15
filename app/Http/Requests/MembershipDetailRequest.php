<?php

namespace App\Http\Requests;

use App\Models\MembershipDetail;
use App\Models\MembershipPayment;
use App\Models\MembershipType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
                // Cash tendered can never be less than what's being applied
                // toward the balance — otherwise "change" would go negative.
                'gte:amount_paid',
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

    /**
     * amount_paid must cover at least the selected plan's listed price.
     * This needs a DB lookup and only applies on store (not update, since
     * update never touches amount_paid), so it can't be a plain string rule.
     */
    public function withValidator(Validator $validator): void
    {
        if (!$this->isMethod('post')) {
            return;
        }

        $validator->after(function (Validator $validator) {
            $membershipTypeId = $this->input('membership_type_id');
            $amountPaid = $this->input('amount_paid');

            if (!$membershipTypeId || $amountPaid === null) {
                return; // let the required/exists rules report this instead
            }

            $membershipType = MembershipType::find($membershipTypeId);

            if ($membershipType && (float) $amountPaid < (float) $membershipType->price) {
                $validator->errors()->add(
                    'amount_paid',
                    "Amount paid must be at least ₱{$membershipType->price} for this plan.",
                );
            }
        });
    }
}