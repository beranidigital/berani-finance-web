<?php

namespace Modules\Accounting\Models;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Accounting\Database\Factories\AccountFactory;

class Account extends Model
{
    use HasFactory;

    protected static function newFactory()
    {
        return AccountFactory::new();
    }

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_system' => 'boolean',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function journalEntryLines(): HasMany
    {
        return $this->hasMany(JournalEntryLine::class);
    }

    public function ledgerEntries(): HasMany
    {
        return $this->hasMany(Ledger::class);
    }

    public function hasChildren(): bool
    {
        return $this->children()->exists();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeWhereCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function getDebitBalanceAttribute(): int
    {
        return (int) $this->ledgerEntries()
            ->where('type', 'debit')
            ->sum('amount');
    }

    public function getCreditBalanceAttribute(): int
    {
        return (int) $this->ledgerEntries()
            ->where('type', 'credit')
            ->sum('amount');
    }

    public function getNetBalanceAttribute(): int
    {
        return match ($this->type) {
            'asset', 'expense' => $this->debit_balance - $this->credit_balance,
            'liability', 'equity', 'revenue' => $this->credit_balance - $this->debit_balance,
            default => 0,
        };
    }
}
