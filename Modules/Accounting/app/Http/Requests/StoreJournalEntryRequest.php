<?php

namespace Modules\Accounting\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJournalEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage accounting');
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'description' => ['required', 'string', 'max:500'],
            'lines' => ['required', 'array', 'min:2'],
            'lines.*.account_id' => ['required', 'integer', 'exists:accounts,id'],
            'lines.*.type' => ['required', 'string', 'in:debit,credit'],
            'lines.*.amount' => ['required', 'integer', 'min:1'],
            'lines.*.description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $lines = $this->input('lines', []);
            $debits = collect($lines)->where('type', 'debit')->sum('amount');
            $credits = collect($lines)->where('type', 'credit')->sum('amount');

            if ($debits !== $credits) {
                $validator->errors()->add('lines', "Total debits ({$debits}) must equal total credits ({$credits}).");
            }
        });
    }
}
