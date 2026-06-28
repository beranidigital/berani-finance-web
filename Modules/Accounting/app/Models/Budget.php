<?php

namespace Modules\Accounting\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Budget extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Company::class);
    }

    public function fiscalPeriod(): BelongsTo
    {
        return $this->belongsTo(FiscalPeriod::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function getSpentAmountAttribute(): int
    {
        return (int) Ledger::where('company_id', $this->company_id)
            ->where('account_id', $this->account_id)
            ->whereBetween('date', [$this->fiscalPeriod->start_date, $this->fiscalPeriod->end_date])
            ->where('type', 'debit')
            ->sum('amount');
    }

    public function scopeWhereCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }
}
