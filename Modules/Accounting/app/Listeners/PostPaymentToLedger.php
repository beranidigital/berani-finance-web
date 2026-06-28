<?php

namespace Modules\Accounting\Listeners;

use App\Events\PaymentReceived;
use Modules\Accounting\Services\DocumentPostingService;

class PostPaymentToLedger
{
    public function __construct(
        private readonly DocumentPostingService $postingService,
    ) {}

    public function handle(PaymentReceived $event): void
    {
        $this->postingService->postPayment($event->payment);
    }
}
