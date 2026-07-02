<?php

namespace Modules\Accounting\Listeners;

use App\Events\FinancialDocumentCreated;
use App\Models\Invoice;
use Modules\Accounting\Services\DocumentPostingService;

class PostInvoiceToLedger
{
    public function __construct(
        private readonly DocumentPostingService $postingService,
    ) {}

    public function handle(FinancialDocumentCreated $event): void
    {
        if ($event->model instanceof Invoice) {
            $this->postingService->postInvoice($event->model);
        }
    }
}
