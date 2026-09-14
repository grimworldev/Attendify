<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var User|null $user */
        $user = $this->route('user');

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                $user
                ? Rule::unique('users', 'username')->ignore($user->id)
                : Rule::unique('users', 'username'),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                $user
                ? Rule::unique('users', 'email')->ignore($user->id)
                : Rule::unique('users', 'email'),
            ],
            'gender' => ['required', 'string', 'in:Male,Female,Others'],
            'role_id' => ['nullable', 'exists:roles,id'],
            'password' => [
                $user ? 'nullable' : 'required',
                Password::defaults(),
            ],
        ];
    }
}