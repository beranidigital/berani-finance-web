<?php

namespace Modules\Accounting\Console\Commands;

use App\Models\Company;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Console\Command;
use Modules\Accounting\Models\JournalEntry;

class CheckAccountingIntegrity extends Command
{
    protected $signature = 'accounting:check {--company= : Company ID to check}';
    protected $description = 'Verify every financial document has a corresponding journal entry';

    public function handle(): int
    {
        $companyId = $this->option('company');

        $companies = $companyId
            ? Company::where('id', $companyId)->get()
            : Company::all();

        $issues = 0;

        foreach ($companies as $company) {
            $this->info("Checking company {$company->id}...");

            foreach (Invoice::where('company_id', $company->id)->get() as $invoice) {
                if (! JournalEntry::where('reference_type', 'invoice')->where('reference_id', $invoice->id)->exists()) {
                    $this->warn("  Missing entry for Invoice #{$invoice->invoice_number} (id: {$invoice->id})");
                    $issues++;
                }
            }

            foreach (Payment::where('company_id', $company->id)->get() as $payment) {
                if (! JournalEntry::where('reference_type', 'payment')->where('reference_id', $payment->id)->exists()) {
                    $this->warn("  Missing entry for Payment #{$payment->payment_number} (id: {$payment->id})");
                    $issues++;
                }
            }

            foreach (Expense::where('company_id', $company->id)->get() as $expense) {
                if (! JournalEntry::where('reference_type', 'expense')->where('reference_id', $expense->id)->exists()) {
                    $this->warn("  Missing entry for Expense #{$expense->id}");
                    $issues++;
                }
            }
        }

        if ($issues === 0) {
            $this->info('All documents have corresponding journal entries.');
        } else {
            $this->error("Found {$issues} documents without journal entries.");
        }

        return 0;
    }
}
