<?php

namespace Modules\Accounting\Console\Commands;

use App\Models\Company;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Console\Command;
use Modules\Accounting\Models\JournalEntry;
use Modules\Accounting\Services\DocumentPostingService;

class RepairAccountingEntries extends Command
{
    protected $signature = 'accounting:repair {--company= : Company ID to repair}';

    protected $description = 'Create missing journal entries for existing documents';

    public function handle(): int
    {
        $companyId = $this->option('company');
        $service = app(DocumentPostingService::class);

        $companies = $companyId
            ? Company::where('id', $companyId)->get()
            : Company::all();

        $created = 0;

        foreach ($companies as $company) {
            $this->info("Processing company {$company->id}...");

            foreach (Invoice::where('company_id', $company->id)->get() as $invoice) {
                if (! JournalEntry::where('reference_type', 'invoice')->where('reference_id', $invoice->id)->exists()) {
                    $service->postInvoice($invoice);
                    $this->info("  Created entry for Invoice #{$invoice->invoice_number}");
                    $created++;
                }
            }

            foreach (Payment::where('company_id', $company->id)->get() as $payment) {
                if (! JournalEntry::where('reference_type', 'payment')->where('reference_id', $payment->id)->exists()) {
                    $service->postPayment($payment);
                    $this->info("  Created entry for Payment #{$payment->payment_number}");
                    $created++;
                }
            }

            foreach (Expense::where('company_id', $company->id)->get() as $expense) {
                if (! JournalEntry::where('reference_type', 'expense')->where('reference_id', $expense->id)->exists()) {
                    $service->postExpense($expense);
                    $this->info("  Created entry for Expense #{$expense->id}");
                    $created++;
                }
            }
        }

        $this->info("Created {$created} missing journal entries.");

        return 0;
    }
}
