<?php

namespace Modules\Accounting\Models;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JournalEntry extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_balanced' => 'boolean',
            'posted_at' => 'datetime',
        ];
    }

    public function lines(): HasMany
    {
        return $this->hasMany(JournalEntryLine::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isBalanced(): bool
    {
        $debits = $this->lines()->where('type', 'debit')->sum('amount');
        $credits = $this->lines()->where('type', 'credit')->sum('amount');

        return $debits === $credits;
    }

    public function scopeWhereCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopeUnbalanced($query)
    {
        return $query->where('is_balanced', false);
    }

    public function scopeForDateRange($query, $start, $end)
    {
        return $query->whereBetween('date', [$start, $end]);
    }
}
