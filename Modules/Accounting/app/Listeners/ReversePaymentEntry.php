<?php

namespace Modules\Accounting\Listeners;

use App\Events\PaymentRefunded;
use Modules\Accounting\Services\DocumentPostingService;

class ReversePaymentEntry
{
    public function __construct(
        private readonly DocumentPostingService $postingService,
    ) {}

    public function handle(PaymentRefunded $event): void
    {
        $this->postingService->reversePayment($event->payment);
    }
}
