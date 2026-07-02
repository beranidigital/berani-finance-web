<?php

namespace Modules\Accounting\Services;

use Illuminate\Support\Facades\DB;
use Modules\Accounting\Models\Account;
use Modules\Accounting\Models\Ledger;

class ReportService
{
    public function trialBalance(int $companyId, ?string $asOfDate = null): array
    {
        $query = Ledger::where('company_id', $companyId);

        if ($asOfDate) {
            $query->where('date', '<=', $asOfDate);
        }

        $balances = $query->select(
            'account_id',
            DB::raw("SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as total_debits"),
            DB::raw("SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as total_credits")
        )
            ->groupBy('account_id')
            ->get();

        $accounts = Account::whereCompany($companyId)->get()->keyBy('id');

        $rows = [];
        $totalDebits = 0;
        $totalCredits = 0;

        foreach ($balances as $balance) {
            $account = $accounts->get($balance->account_id);
            if (! $account) {
                continue;
            }

            $debits = (int) $balance->total_debits;
            $credits = (int) $balance->total_credits;

            $netDebit = 0;
            $netCredit = 0;

            if (in_array($account->type, ['asset', 'expense'])) {
                $netDebit = max(0, $debits - $credits);
                $netCredit = max(0, $credits - $debits);
            } else {
                $netCredit = max(0, $credits - $debits);
                $netDebit = max(0, $debits - $credits);
            }

            $totalDebits += $netDebit;
            $totalCredits += $netCredit;

            $rows[] = [
                'account_code' => $account->code,
                'account_name' => $account->name,
                'account_type' => $account->type,
                'debit' => $netDebit,
                'credit' => $netCredit,
            ];
        }

        return [
            'rows' => $rows,
            'total_debits' => $totalDebits,
            'total_credits' => $totalCredits,
            'difference' => $totalDebits - $totalCredits,
            'as_of_date' => $asOfDate ?? now()->format('Y-m-d'),
        ];
    }

    public function balanceSheet(int $companyId, ?string $asOfDate = null): array
    {
        $asOfDate = $asOfDate ?? now()->format('Y-m-d');

        $accounts = Account::whereCompany($companyId)
            ->whereIn('type', ['asset', 'liability', 'equity'])
            ->get();

        $assets = [];
        $liabilities = [];
        $equities = [];
        $totalAssets = 0;
        $totalLiabilities = 0;
        $totalEquity = 0;

        foreach ($accounts as $account) {
            $balance = $account->net_balance;

            if ($account->type === 'asset') {
                $assets[] = ['code' => $account->code, 'name' => $account->name, 'balance' => $balance];
                $totalAssets += $balance;
            } elseif ($account->type === 'liability') {
                $liabilities[] = ['code' => $account->code, 'name' => $account->name, 'balance' => $balance];
                $totalLiabilities += $balance;
            } elseif ($account->type === 'equity') {
                $equities[] = ['code' => $account->code, 'name' => $account->name, 'balance' => $balance];
                $totalEquity += $balance;
            }
        }

        $netIncome = $this->calculateNetIncome($companyId, $asOfDate);
        if ($netIncome !== 0) {
            $equities[] = ['code' => '', 'name' => 'Retained Earnings (Current Period)', 'balance' => $netIncome];
            $totalEquity += $netIncome;
        }

        return [
            'as_of_date' => $asOfDate,
            'assets' => ['items' => $assets, 'total' => $totalAssets],
            'liabilities' => ['items' => $liabilities, 'total' => $totalLiabilities],
            'equity' => ['items' => $equities, 'total' => $totalEquity],
            'total_liabilities_equity' => $totalLiabilities + $totalEquity,
        ];
    }

    private function calculateNetIncome(int $companyId, string $asOfDate): int
    {
        $incomeAccounts = Account::whereCompany($companyId)
            ->whereIn('type', ['revenue', 'expense'])
            ->get()
            ->keyBy('id');

        $entries = Ledger::where('company_id', $companyId)
            ->where('date', '<=', $asOfDate)
            ->select(
                'account_id',
                DB::raw("SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as total_debits"),
                DB::raw("SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as total_credits")
            )
            ->groupBy('account_id')
            ->get();

        $totalRevenue = 0;
        $totalExpenses = 0;

        foreach ($entries as $entry) {
            $account = $incomeAccounts->get($entry->account_id);
            if (! $account) {
                continue;
            }

            if ($account->type === 'revenue') {
                $totalRevenue += (int) $entry->total_credits - (int) $entry->total_debits;
            } elseif ($account->type === 'expense') {
                $totalExpenses += (int) $entry->total_debits - (int) $entry->total_credits;
            }
        }

        return $totalRevenue - $totalExpenses;
    }

    public function incomeStatement(int $companyId, string $startDate, string $endDate): array
    {
        $accounts = Account::whereCompany($companyId)
            ->whereIn('type', ['revenue', 'expense'])
            ->get()
            ->keyBy('id');

        $entries = Ledger::where('company_id', $companyId)
            ->whereBetween('date', [$startDate, $endDate])
            ->select(
                'account_id',
                DB::raw("SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as total_debits"),
                DB::raw("SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as total_credits")
            )
            ->groupBy('account_id')
            ->get();

        $revenues = [];
        $expenses = [];
        $totalRevenue = 0;
        $totalExpenses = 0;

        foreach ($entries as $entry) {
            $account = $accounts->get($entry->account_id);
            if (! $account) {
                continue;
            }

            $balance = (int) $entry->total_credits - (int) $entry->total_debits;

            if ($account->type === 'revenue') {
                $revenues[] = ['code' => $account->code, 'name' => $account->name, 'amount' => abs($balance)];
                $totalRevenue += abs($balance);
            } elseif ($account->type === 'expense') {
                $expenses[] = ['code' => $account->code, 'name' => $account->name, 'amount' => abs($balance)];
                $totalExpenses += abs($balance);
            }
        }

        return [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'revenues' => ['items' => $revenues, 'total' => $totalRevenue],
            'expenses' => ['items' => $expenses, 'total' => $totalExpenses],
            'net_income' => $totalRevenue - $totalExpenses,
        ];
    }

    public function cashFlow(int $companyId, string $startDate, string $endDate): array
    {
        $cashAccount = Account::whereCompany($companyId)->where('code', '1100')->first();

        if (! $cashAccount) {
            return [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'operating' => ['total' => 0],
                'financing' => ['total' => 0],
                'investing' => ['total' => 0],
                'net_change' => 0,
            ];
        }

        $entries = Ledger::where('company_id', $companyId)
            ->where('account_id', $cashAccount->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->select(
                'type',
                DB::raw('SUM(amount) as total'),
                'journal_entry_id'
            )
            ->groupBy('type', 'journal_entry_id')
            ->get();

        $inflows = $entries->where('type', 'debit')->sum('total');
        $outflows = $entries->where('type', 'credit')->sum('total');

        return [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'operating' => ['total' => (int) $inflows - (int) $outflows],
            'financing' => ['total' => 0],
            'investing' => ['total' => 0],
            'net_change' => (int) $inflows - (int) $outflows,
        ];
    }

    public function arAging(int $companyId, string $asOfDate): array
    {
        $arAccount = Account::whereCompany($companyId)->where('code', '1200')->first();

        if (! $arAccount) {
            return ['rows' => [], 'total_ar' => 0, 'as_of_date' => $asOfDate];
        }

        $ledgerEntries = Ledger::where('company_id', $companyId)
            ->where('account_id', $arAccount->id)
            ->where('date', '<=', $asOfDate)
            ->orderBy('date')
            ->get();

        $rows = [];
        $runningBalance = 0;

        foreach ($ledgerEntries as $entry) {
            if ($entry->type === 'debit') {
                $runningBalance += (int) $entry->amount;
            } else {
                $runningBalance -= (int) $entry->amount;
            }
        }

        $totalAr = max(0, $runningBalance);

        return [
            'as_of_date' => $asOfDate,
            'rows' => $rows,
            'total_ar' => $totalAr,
        ];
    }

    public function apAging(int $companyId, string $asOfDate): array
    {
        $apAccount = Account::whereCompany($companyId)->where('code', '2100')->first();

        if (! $apAccount) {
            return ['rows' => [], 'total_ap' => 0, 'as_of_date' => $asOfDate];
        }

        $ledgerEntries = Ledger::where('company_id', $companyId)
            ->where('account_id', $apAccount->id)
            ->where('date', '<=', $asOfDate)
            ->orderBy('date')
            ->get();

        $rows = [];
        $runningBalance = 0;

        foreach ($ledgerEntries as $entry) {
            if ($entry->type === 'credit') {
                $runningBalance += (int) $entry->amount;
            } else {
                $runningBalance -= (int) $entry->amount;
            }
        }

        $totalAp = max(0, $runningBalance);

        return [
            'as_of_date' => $asOfDate,
            'rows' => $rows,
            'total_ap' => $totalAp,
        ];
    }
}
