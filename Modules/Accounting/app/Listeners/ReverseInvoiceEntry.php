<?php

namespace Modules\Accounting\Listeners;

use App\Events\FinancialDocumentDeleted;
use Modules\Accounting\Services\DocumentPostingService;

class ReverseInvoiceEntry
{
    public function __construct(
        private readonly DocumentPostingService $postingService,
    ) {}

    public function handle(FinancialDocumentDeleted $event): void
    {
        if ($event->modelType === \App\Models\Invoice::class) {
            $invoice = \App\Models\Invoice::withTrashed()->find($event->modelId);
            if ($invoice) {
                $this->postingService->reverseInvoice($invoice);
            }
        }
    }
}
