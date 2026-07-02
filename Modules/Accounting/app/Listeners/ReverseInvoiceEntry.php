<?php

namespace Modules\Accounting\Listeners;

use App\Events\FinancialDocumentDeleted;
use App\Models\Invoice;
use Modules\Accounting\Services\DocumentPostingService;

class ReverseInvoiceEntry
{
    public function __construct(
        private readonly DocumentPostingService $postingService,
    ) {}

    public function handle(FinancialDocumentDeleted $event): void
    {
        if ($event->modelType === Invoice::class) {
            $invoice = Invoice::find($event->modelId);
            if ($invoice) {
                $this->postingService->reverseInvoice($invoice);
            }
        }
    }
}
