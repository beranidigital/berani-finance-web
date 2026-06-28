<?php

namespace Modules\Accounting\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LedgerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'account_id' => $this->account_id,
            'account_name' => $this->whenLoaded('account', fn () => $this->account->name),
            'account_code' => $this->whenLoaded('account', fn () => $this->account->code),
            'journal_entry_id' => $this->journal_entry_id,
            'date' => $this->date->format('Y-m-d'),
            'type' => $this->type,
            'amount' => $this->amount,
            'running_balance' => $this->running_balance,
            'created_at' => $this->created_at,
        ];
    }
}
