<?php

use Modules\Accounting\Models\Account;
use Modules\Accounting\Models\JournalEntry;
use Modules\Accounting\Models\Ledger;
use Modules\Accounting\Services\JournalService;

beforeEach(function () {
    $this->companyId = 1;

    $this->accountAsset = Account::factory()->create([
        'company_id' => $this->companyId,
        'code' => '1100',
        'name' => 'Cash',
        'type' => 'asset',
        'is_system' => true,
    ]);

    $this->accountRevenue = Account::factory()->create([
        'company_id' => $this->companyId,
        'code' => '4100',
        'name' => 'Sales Revenue',
        'type' => 'revenue',
        'is_system' => true,
    ]);

    $this->svc = app(JournalService::class);
});

it('creates a balanced journal entry', function () {
    $entry = $this->svc->createEntry(
        companyId: $this->companyId,
        date: '2026-01-15',
        description: 'Test entry',
        lines: [
            ['account_id' => $this->accountAsset->id, 'type' => 'debit', 'amount' => 10000, 'description' => null],
            ['account_id' => $this->accountRevenue->id, 'type' => 'credit', 'amount' => 10000, 'description' => null],
        ],
    );

    expect($entry)->toBeInstanceOf(JournalEntry::class);
    expect($entry->is_balanced)->toBeTrue();
    expect($entry->entry_number)->not->toBeNull();
    expect($entry->lines)->toHaveCount(2);

    $ledgerEntries = Ledger::where('journal_entry_id', $entry->id)->get();
    expect($ledgerEntries)->toHaveCount(2);
});

it('throws exception for unbalanced entry', function () {
    $this->svc->createEntry(
        companyId: $this->companyId,
        date: '2026-01-15',
        description: 'Unbalanced entry',
        lines: [
            ['account_id' => $this->accountAsset->id, 'type' => 'debit', 'amount' => 10000, 'description' => null],
            ['account_id' => $this->accountRevenue->id, 'type' => 'credit', 'amount' => 5000, 'description' => null],
        ],
    );
})->throws(InvalidArgumentException::class);

it('reverses a journal entry', function () {
    $original = $this->svc->createEntry(
        companyId: $this->companyId,
        date: '2026-01-15',
        description: 'Original entry',
        lines: [
            ['account_id' => $this->accountAsset->id, 'type' => 'debit', 'amount' => 10000, 'description' => null],
            ['account_id' => $this->accountRevenue->id, 'type' => 'credit', 'amount' => 10000, 'description' => null],
        ],
    );

    $reversal = $this->svc->reverseEntry($original);

    expect($reversal)->toBeInstanceOf(JournalEntry::class);
    expect($reversal->is_balanced)->toBeTrue();

    $reversalLines = $reversal->lines;
    expect($reversalLines->firstWhere('type', 'credit')->account_id)->toBe($this->accountAsset->id);
    expect($reversalLines->firstWhere('type', 'debit')->account_id)->toBe($this->accountRevenue->id);
});

it('auto-increments entry numbers', function () {
    $first = $this->svc->createEntry(
        companyId: $this->companyId,
        date: '2026-01-15',
        description: 'First entry',
        lines: [
            ['account_id' => $this->accountAsset->id, 'type' => 'debit', 'amount' => 100, 'description' => null],
            ['account_id' => $this->accountRevenue->id, 'type' => 'credit', 'amount' => 100, 'description' => null],
        ],
    );

    $second = $this->svc->createEntry(
        companyId: $this->companyId,
        date: '2026-01-16',
        description: 'Second entry',
        lines: [
            ['account_id' => $this->accountAsset->id, 'type' => 'debit', 'amount' => 200, 'description' => null],
            ['account_id' => $this->accountRevenue->id, 'type' => 'credit', 'amount' => 200, 'description' => null],
        ],
    );

    expect((int) $second->entry_number)->toBe((int) $first->entry_number + 1);
});
