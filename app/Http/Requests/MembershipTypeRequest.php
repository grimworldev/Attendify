<?php

namespace App\Http\Requests;

use App\Models\MembershipType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MembershipTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var MembershipType|null $membershipType */
        $membershipType = $this->route('membership_type');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                $membershipType
                ? Rule::unique('membership_types', 'slug')->ignore($membershipType->id)
                : Rule::unique('membership_types', 'slug'),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'duration_in_days' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'integer', 'in:0,1'],
        ];
    }

    /**
     * Auto-generate the slug from the name before validation runs.
     */
    protected function prepareForValidation(): void
    {
        if ($this->filled('name')) {
            $this->merge([
                'slug' => Str::slug($this->input('name')),
            ]);
        }
    }
}