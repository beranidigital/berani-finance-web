<?php

namespace Modules\Accounting\Services;

use App\Models\CompanySetting;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Payment;
use Modules\Accounting\Models\Account;
use Modules\Accounting\Models\JournalEntry;

class DocumentPostingService
{
    public function __construct(
        private readonly JournalService $journalService,
    ) {}

    public function postInvoice(Invoice $invoice): void
    {
        $arAccountId = $this->getSettingAccount($invoice->company_id, 'default_ar_account', '1200');
        $revenueAccountId = $this->getSettingAccount($invoice->company_id, 'default_revenue_account', '4100');

        if (! $arAccountId || ! $revenueAccountId) {
            return;
        }

        $this->journalService->createEntry(
            companyId: $invoice->company_id,
            date: $invoice->invoice_date->format('Y-m-d'),
            description: "Invoice {$invoice->invoice_number}",
            createdBy: $this->getUserId(),
            lines: [
                [
                    'account_id' => $arAccountId,
                    'type' => 'debit',
                    'amount' => $invoice->base_total,
                    'description' => "Invoice {$invoice->invoice_number}",
                ],
                [
                    'account_id' => $revenueAccountId,
                    'type' => 'credit',
                    'amount' => $invoice->base_total,
                    'description' => "Invoice {$invoice->invoice_number}",
                ],
            ],
            referenceType: 'invoice',
            referenceId: $invoice->id,
        );
    }

    public function postPayment(Payment $payment): void
    {
        $cashAccountId = $this->getSettingAccount($payment->company_id, 'default_cash_account', '1100');
        $arAccountId = $this->getSettingAccount($payment->company_id, 'default_ar_account', '1200');

        if (! $cashAccountId || ! $arAccountId) {
            return;
        }

        $this->journalService->createEntry(
            companyId: $payment->company_id,
            date: $payment->payment_date->format('Y-m-d'),
            description: "Payment {$payment->payment_number}",
            createdBy: $this->getUserId(),
            lines: [
                [
                    'account_id' => $cashAccountId,
                    'type' => 'debit',
                    'amount' => $payment->base_amount,
                    'description' => "Payment {$payment->payment_number}",
                ],
                [
                    'account_id' => $arAccountId,
                    'type' => 'credit',
                    'amount' => $payment->base_amount,
                    'description' => "Payment {$payment->payment_number}",
                ],
            ],
            referenceType: 'payment',
            referenceId: $payment->id,
        );
    }

    public function postExpense(Expense $expense): void
    {
        $expenseAccountId = $this->getExpenseCategoryAccount($expense);
        $cashAccountId = $this->getSettingAccount($expense->company_id, 'default_cash_account', '1100');

        if (! $expenseAccountId || ! $cashAccountId) {
            return;
        }

        $this->journalService->createEntry(
            companyId: $expense->company_id,
            date: $expense->expense_date->format('Y-m-d'),
            description: "Expense #{$expense->id}",
            createdBy: $this->getUserId(),
            lines: [
                [
                    'account_id' => $expenseAccountId,
                    'type' => 'debit',
                    'amount' => $expense->base_amount,
                    'description' => $expense->notes ?? "Expense #{$expense->id}",
                ],
                [
                    'account_id' => $cashAccountId,
                    'type' => 'credit',
                    'amount' => $expense->base_amount,
                    'description' => $expense->notes ?? "Expense #{$expense->id}",
                ],
            ],
            referenceType: 'expense',
            referenceId: $expense->id,
        );
    }

    public function reverseInvoice(Invoice $invoice): void
    {
        $entry = JournalEntry::where('company_id', $invoice->company_id)
            ->where('reference_type', 'invoice')
            ->where('reference_id', $invoice->id)
            ->first();

        if ($entry) {
            $this->journalService->reverseEntry($entry);
        }
    }

    public function reversePayment(Payment $payment): void
    {
        $entry = JournalEntry::where('company_id', $payment->company_id)
            ->where('reference_type', 'payment')
            ->where('reference_id', $payment->id)
            ->first();

        if ($entry) {
            $this->journalService->reverseEntry($entry);
        }
    }

    private function getSettingAccount(int $companyId, string $settingKey, string $defaultCode): ?int
    {
        $accountId = CompanySetting::getSetting("module.accounting.{$settingKey}", $companyId);

        if ($accountId) {
            return (int) $accountId;
        }

        $default = Account::where('company_id', $companyId)
            ->where('code', $defaultCode)
            ->first();

        return $default?->id;
    }

    private function getExpenseCategoryAccount(Expense $expense): ?int
    {
        $defaultExpenseAccount = CompanySetting::getSetting(
            'module.accounting.default_expense_account',
            $expense->company_id
        );

        if ($defaultExpenseAccount) {
            return (int) $defaultExpenseAccount;
        }

        $expenseAccount = Account::where('company_id', $expense->company_id)
            ->where('code', '5200')
            ->first();

        return $expenseAccount?->id;
    }

    private function getUserId(): ?int
    {
        return auth()->id();
    }
}
