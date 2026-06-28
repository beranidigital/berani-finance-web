<?php

namespace Modules\Accounting\Listeners;

use App\Events\ExpenseRecorded;
use Modules\Accounting\Services\DocumentPostingService;

class PostExpenseToLedger
{
    public function __construct(
        private readonly DocumentPostingService $postingService,
    ) {}

    public function handle(ExpenseRecorded $event): void
    {
        $this->postingService->postExpense($event->expense);
    }
}
