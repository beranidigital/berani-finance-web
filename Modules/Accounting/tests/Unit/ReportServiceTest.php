<?php

use Modules\Accounting\Models\Account;
use Modules\Accounting\Services\JournalService;
use Modules\Accounting\Services\ReportService;

beforeEach(function () {
    $this->companyId = 1;

    $this->cash = Account::factory()->create(['company_id' => $this->companyId, 'code' => '1100', 'name' => 'Cash', 'type' => 'asset', 'is_system' => true]);
    $this->ar = Account::factory()->create(['company_id' => $this->companyId, 'code' => '1200', 'name' => 'AR', 'type' => 'asset', 'is_system' => true]);
    $this->revenue = Account::factory()->create(['company_id' => $this->companyId, 'code' => '4100', 'name' => 'Revenue', 'type' => 'revenue', 'is_system' => true]);
    $this->expense = Account::factory()->create(['company_id' => $this->companyId, 'code' => '5200', 'name' => 'OpEx', 'type' => 'expense', 'is_system' => true]);

    $this->journalSvc = app(JournalService::class);

    // Create an invoice entry: Dr AR 1000, Cr Revenue 1000
    $this->journalSvc->createEntry($this->companyId, '2026-01-15', 'Invoice', [
        ['account_id' => $this->ar->id, 'type' => 'debit', 'amount' => 100000, 'description' => null],
        ['account_id' => $this->revenue->id, 'type' => 'credit', 'amount' => 100000, 'description' => null],
    ], createdBy: 1);

    // Create a payment entry: Dr Cash 500, Cr AR 500
    $this->journalSvc->createEntry($this->companyId, '2026-01-20', 'Payment', [
        ['account_id' => $this->cash->id, 'type' => 'debit', 'amount' => 50000, 'description' => null],
        ['account_id' => $this->ar->id, 'type' => 'credit', 'amount' => 50000, 'description' => null],
    ], createdBy: 1);

    // Create an expense entry: Dr OpEx 200, Cr Cash 200
    $this->journalSvc->createEntry($this->companyId, '2026-01-25', 'Expense', [
        ['account_id' => $this->expense->id, 'type' => 'debit', 'amount' => 20000, 'description' => null],
        ['account_id' => $this->cash->id, 'type' => 'credit', 'amount' => 20000, 'description' => null],
    ], createdBy: 1);
});

it('generates a balanced trial balance', function () {
    $svc = app(ReportService::class);
    $result = $svc->trialBalance($this->companyId);

    expect($result['total_debits'])->toBe($result['total_credits']);
    expect($result['difference'])->toBe(0);
});

it('generates a balance sheet with matching totals', function () {
    $svc = app(ReportService::class);
    $result = $svc->balanceSheet($this->companyId);

    expect($result['assets']['total'])->toBeGreaterThan(0);
    expect($result['assets']['total'])->toBe($result['total_liabilities_equity']);
});

it('generates an income statement with net income', function () {
    $svc = app(ReportService::class);
    $result = $svc->incomeStatement($this->companyId, '2026-01-01', '2026-01-31');

    expect($result['revenues']['total'])->toBe(100000);
    expect($result['expenses']['total'])->toBe(20000);
    expect($result['net_income'])->toBe(80000);
});

it('generates ar aging', function () {
    $svc = app(ReportService::class);
    $result = $svc->arAging($this->companyId, '2026-01-31');

    expect($result['total_ar'])->toBe(50000);
});

it('generates cash flow', function () {
    $svc = app(ReportService::class);
    $result = $svc->cashFlow($this->companyId, '2026-01-01', '2026-01-31');

    // Cash in: 50000 (payment) - Cash out: 20000 (expense) = 30000 net
    expect($result['net_change'])->toBe(30000);
});
