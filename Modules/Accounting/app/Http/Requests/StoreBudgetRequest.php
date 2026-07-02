<?php

namespace Modules\Accounting\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage-accounting');
    }

    public function rules(): array
    {
        return [
            'fiscal_period_id' => ['required', 'integer', 'exists:fiscal_periods,id'],
            'account_id' => ['required', 'integer', 'exists:accounts,id'],
            'amount' => ['required', 'integer', 'min:0'],
        ];
    }
}
