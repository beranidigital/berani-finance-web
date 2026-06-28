<?php

namespace Modules\Accounting\Services;

use Modules\Accounting\Models\Ledger;

class LedgerService
{
    public function post(
        int $companyId,
        int $accountId,
        int $journalEntryId,
        int $journalEntryLineId,
        string $date,
        string $type,
        int $amount,
    ): Ledger {
        $lastBalance = Ledger::where('company_id', $companyId)
            ->where('account_id', $accountId)
            ->orderBy('id', 'desc')
            ->value('running_balance') ?? 0;

        $runningBalance = $type === 'debit'
            ? $lastBalance + $amount
            : $lastBalance - $amount;

        return Ledger::create([
            'company_id' => $companyId,
            'account_id' => $accountId,
            'journal_entry_id' => $journalEntryId,
            'journal_entry_line_id' => $journalEntryLineId,
            'date' => $date,
            'type' => $type,
            'amount' => $amount,
            'running_balance' => $runningBalance,
        ]);
    }

    public function getBalance(int $companyId, int $accountId, ?string $asOfDate = null): int
    {
        $query = Ledger::where('company_id', $companyId)
            ->where('account_id', $accountId);

        if ($asOfDate) {
            $query->where('date', '<=', $asOfDate);
        }

        $latest = $query->orderBy('id', 'desc')->first();

        return $latest ? $latest->running_balance : 0;
    }

    public function getBalanceForDateRange(int $companyId, int $accountId, string $startDate, string $endDate): array
    {
        $debits = Ledger::where('company_id', $companyId)
            ->where('account_id', $accountId)
            ->where('type', 'debit')
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('amount');

        $credits = Ledger::where('company_id', $companyId)
            ->where('account_id', $accountId)
            ->where('type', 'credit')
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('amount');

        return [
            'debits' => (int) $debits,
            'credits' => (int) $credits,
            'net' => (int) $debits - (int) $credits,
        ];
    }
}
