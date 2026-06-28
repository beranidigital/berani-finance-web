<?php

use App\Models\Company;
use App\Models\CompanySetting;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Expense;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Modules\Accounting\Models\Account;
use Modules\Accounting\Models\JournalEntry;
use Modules\Accounting\Services\JournalService;
use Modules\Accounting\Services\LedgerService;

return new class extends Migration
{
    public function up(): void
    {
        $journalService = app(JournalService::class);

        foreach (Company::all() as $company) {
            $this->ensureDefaultAccounts($company->id);

            foreach (Invoice::where('company_id', $company->id)->get() as $invoice) {
                if (! JournalEntry::where('reference_type', 'invoice')->where('reference_id', $invoice->id)->exists()) {
                    $this->postInvoiceEntry($journalService, $invoice);
                }
            }

            foreach (Payment::where('company_id', $company->id)->get() as $payment) {
                if (! JournalEntry::where('reference_type', 'payment')->where('reference_id', $payment->id)->exists()) {
                    $this->postPaymentEntry($journalService, $payment);
                }
            }

            foreach (Expense::where('company_id', $company->id)->get() as $expense) {
                if (! JournalEntry::where('reference_type', 'expense')->where('reference_id', $expense->id)->exists()) {
                    $this->postExpenseEntry($journalService, $expense);
                }
            }
        }
    }

    public function down(): void
    {
        // Irreversible — data migration
    }

    private function ensureDefaultAccounts(int $companyId): void
    {
        $defaults = [
            ['code' => '1100', 'name' => 'Cash', 'type' => 'asset'],
            ['code' => '1200', 'name' => 'Accounts Receivable', 'type' => 'asset'],
            ['code' => '2100', 'name' => 'Accounts Payable', 'type' => 'liability'],
            ['code' => '4100', 'name' => 'Sales Revenue', 'type' => 'revenue'],
            ['code' => '5200', 'name' => 'Operating Expenses', 'type' => 'expense'],
        ];

        foreach ($defaults as $acc) {
            Account::firstOrCreate(
                ['company_id' => $companyId, 'code' => $acc['code']],
                ['name' => $acc['name'], 'type' => $acc['type'], 'is_system' => true]
            );
        }
    }

    private function postInvoiceEntry(JournalService $svc, Invoice $invoice): void
    {
        $arId = Account::where('company_id', $invoice->company_id)->where('code', '1200')->first()?->id;
        $revId = Account::where('company_id', $invoice->company_id)->where('code', '4100')->first()?->id;
        if (! $arId || ! $revId) { return; }

        $svc->createEntry(
            companyId: $invoice->company_id,
            date: $invoice->invoice_date->format('Y-m-d'),
            description: "Invoice {$invoice->invoice_number} (migrated)",
            lines: [
                ['account_id' => $arId, 'type' => 'debit', 'amount' => $invoice->base_total, 'description' => null],
                ['account_id' => $revId, 'type' => 'credit', 'amount' => $invoice->base_total, 'description' => null],
            ],
            referenceType: 'invoice',
            referenceId: $invoice->id,
        );
    }

    private function postPaymentEntry(JournalService $svc, Payment $payment): void
    {
        $cashId = Account::where('company_id', $payment->company_id)->where('code', '1100')->first()?->id;
        $arId = Account::where('company_id', $payment->company_id)->where('code', '1200')->first()?->id;
        if (! $cashId || ! $arId) { return; }

        $svc->createEntry(
            companyId: $payment->company_id,
            date: $payment->payment_date->format('Y-m-d'),
            description: "Payment {$payment->payment_number} (migrated)",
            lines: [
                ['account_id' => $cashId, 'type' => 'debit', 'amount' => $payment->base_amount, 'description' => null],
                ['account_id' => $arId, 'type' => 'credit', 'amount' => $payment->base_amount, 'description' => null],
            ],
            referenceType: 'payment',
            referenceId: $payment->id,
        );
    }

    private function postExpenseEntry(JournalService $svc, Expense $expense): void
    {
        $expId = Account::where('company_id', $expense->company_id)->where('code', '5200')->first()?->id;
        $cashId = Account::where('company_id', $expense->company_id)->where('code', '1100')->first()?->id;
        if (! $expId || ! $cashId) { return; }

        $svc->createEntry(
            companyId: $expense->company_id,
            date: $expense->expense_date->format('Y-m-d'),
            description: "Expense #{$expense->id} (migrated)",
            lines: [
                ['account_id' => $expId, 'type' => 'debit', 'amount' => $expense->base_amount, 'description' => null],
                ['account_id' => $cashId, 'type' => 'credit', 'amount' => $expense->base_amount, 'description' => null],
            ],
            referenceType: 'expense',
            referenceId: $expense->id,
        );
    }
};
