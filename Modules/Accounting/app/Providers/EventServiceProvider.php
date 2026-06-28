<?php

namespace Modules\Accounting\Providers;

use App\Events\ExpenseRecorded;
use App\Events\FinancialDocumentCreated;
use App\Events\FinancialDocumentDeleted;
use App\Events\PaymentReceived;
use App\Events\PaymentRefunded;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Modules\Accounting\Listeners\PostExpenseToLedger;
use Modules\Accounting\Listeners\PostInvoiceToLedger;
use Modules\Accounting\Listeners\PostPaymentToLedger;
use Modules\Accounting\Listeners\ReverseInvoiceEntry;
use Modules\Accounting\Listeners\ReversePaymentEntry;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        FinancialDocumentCreated::class => [
            PostInvoiceToLedger::class,
        ],
        PaymentReceived::class => [
            PostPaymentToLedger::class,
        ],
        ExpenseRecorded::class => [
            PostExpenseToLedger::class,
        ],
        FinancialDocumentDeleted::class => [
            ReverseInvoiceEntry::class,
        ],
        PaymentRefunded::class => [
            ReversePaymentEntry::class,
        ],
    ];

    protected function configureEmailVerification(): void {}
}
