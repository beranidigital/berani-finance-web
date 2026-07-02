<?php

use Illuminate\Support\Facades\Route;
use Modules\Accounting\Http\Controllers\AccountController;
use Modules\Accounting\Http\Controllers\BudgetController;
use Modules\Accounting\Http\Controllers\FiscalPeriodController;
use Modules\Accounting\Http\Controllers\JournalEntryController;
use Modules\Accounting\Http\Controllers\LedgerController;
use Modules\Accounting\Http\Controllers\ReportController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('accounting/accounts', AccountController::class)->names('accounting.accounts');
    Route::apiResource('accounting/journal-entries', JournalEntryController::class)->names('accounting.journal-entries');
    Route::post('accounting/journal-entries/{journal_entry}/reverse', [JournalEntryController::class, 'reverse'])->name('accounting.journal-entries.reverse');
    Route::apiResource('accounting/fiscal-periods', FiscalPeriodController::class)->names('accounting.fiscal-periods');
    Route::post('accounting/fiscal-periods/{fiscal_period}/close', [FiscalPeriodController::class, 'close'])->name('accounting.fiscal-periods.close');
    Route::post('accounting/fiscal-periods/{fiscal_period}/reopen', [FiscalPeriodController::class, 'reopen'])->name('accounting.fiscal-periods.reopen');
    Route::apiResource('accounting/budgets', BudgetController::class)->names('accounting.budgets');
    Route::get('accounting/ledger', [LedgerController::class, 'index'])->name('accounting.ledger.index');
    Route::get('accounting/reports/trial-balance', [ReportController::class, 'trialBalance'])->name('accounting.reports.trial-balance');
    Route::get('accounting/reports/balance-sheet', [ReportController::class, 'balanceSheet'])->name('accounting.reports.balance-sheet');
    Route::get('accounting/reports/income-statement', [ReportController::class, 'incomeStatement'])->name('accounting.reports.income-statement');
    Route::get('accounting/reports/cash-flow', [ReportController::class, 'cashFlow'])->name('accounting.reports.cash-flow');
    Route::get('accounting/reports/ar-aging', [ReportController::class, 'arAging'])->name('accounting.reports.ar-aging');
    Route::get('accounting/reports/ap-aging', [ReportController::class, 'apAging'])->name('accounting.reports.ap-aging');
});
