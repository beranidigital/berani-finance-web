<?php

namespace Modules\Accounting\Services;

use Illuminate\Support\Facades\DB;
use Modules\Accounting\Models\JournalEntry;

class JournalService
{
    public function __construct(
        private readonly LedgerService $ledgerService,
    ) {}

    public function createEntry(
        int $companyId,
        string $date,
        string $description,
        array $lines,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?int $createdBy = null,
    ): JournalEntry {
        DB::transaction(function () use ($companyId, $date, $description, $lines, $referenceType, $referenceId, $createdBy, &$entry) {
            $totalDebits = collect($lines)->where('type', 'debit')->sum('amount');
            $totalCredits = collect($lines)->where('type', 'credit')->sum('amount');

            if ($totalDebits !== $totalCredits) {
                throw new \InvalidArgumentException(
                    "Journal entry is not balanced. Debits: {$totalDebits}, Credits: {$totalCredits}"
                );
            }

            $entry = JournalEntry::create([
                'company_id' => $companyId,
                'entry_number' => $this->nextEntryNumber($companyId),
                'date' => $date,
                'description' => $description,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'created_by' => $createdBy ?? auth()->id(),
                'is_balanced' => true,
                'posted_at' => now(),
            ]);

            foreach ($lines as $line) {
                $entryLine = $entry->lines()->create([
                    'account_id' => $line['account_id'],
                    'type' => $line['type'],
                    'amount' => $line['amount'],
                    'description' => $line['description'] ?? null,
                    'company_id' => $companyId,
                ]);

                $this->ledgerService->post(
                    companyId: $companyId,
                    accountId: $line['account_id'],
                    journalEntryId: $entry->id,
                    journalEntryLineId: $entryLine->id,
                    date: $date,
                    type: $line['type'],
                    amount: $line['amount'],
                );
            }

            $entry->load('lines', 'lines.account');
        });

        return $entry;
    }

    public function reverseEntry(JournalEntry $entry): JournalEntry
    {
        $lines = $entry->lines->map(function ($line) {
            return [
                'account_id' => $line->account_id,
                'type' => $line->type === 'debit' ? 'credit' : 'debit',
                'amount' => $line->amount,
                'description' => 'Reversal: ' . ($line->description ?? $entry->description),
            ];
        });

        return $this->createEntry(
            companyId: $entry->company_id,
            date: now()->format('Y-m-d'),
            description: "Reversal of entry {$entry->entry_number}: {$entry->description}",
            lines: $lines->toArray(),
            referenceType: $entry->reference_type,
            referenceId: $entry->reference_id,
            createdBy: $entry->created_by,
        );
    }

    private function nextEntryNumber(int $companyId): string
    {
        $last = JournalEntry::where('company_id', $companyId)
            ->orderBy('id', 'desc')
            ->value('entry_number');

        $next = $last ? (int) $last + 1 : 1;

        return str_pad((string) $next, 6, '0', STR_PAD_LEFT);
    }
}
