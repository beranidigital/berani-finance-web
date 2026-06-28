<?php

namespace Modules\Accounting\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class JournalEntryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'entry_number' => $this->entry_number,
            'date' => $this->date->format('Y-m-d'),
            'description' => $this->description,
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
            'created_by' => $this->created_by,
            'is_balanced' => $this->is_balanced,
            'posted_at' => $this->posted_at,
            'lines' => JournalEntryLineResource::collection($this->whenLoaded('lines')),
            'debits_total' => $this->whenLoaded('lines', fn () => (int) $this->lines->where('type', 'debit')->sum('amount')),
            'credits_total' => $this->whenLoaded('lines', fn () => (int) $this->lines->where('type', 'credit')->sum('amount')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
