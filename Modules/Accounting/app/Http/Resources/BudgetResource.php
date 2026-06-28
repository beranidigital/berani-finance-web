<?php

namespace Modules\Accounting\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BudgetResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'fiscal_period_id' => $this->fiscal_period_id,
            'fiscal_period_name' => $this->whenLoaded('fiscalPeriod', fn () => $this->fiscalPeriod->name),
            'account_id' => $this->account_id,
            'account_name' => $this->whenLoaded('account', fn () => $this->account->name),
            'account_code' => $this->whenLoaded('account', fn () => $this->account->code),
            'amount' => $this->amount,
            'spent_amount' => $this->spent_amount,
            'remaining' => $this->amount - $this->spent_amount,
            'percentage' => $this->amount > 0 ? round(($this->spent_amount / $this->amount) * 100, 2) : 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
