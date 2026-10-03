<?php

namespace App\Events;

use App\Domains\Receivables\Models\Payment;
use Illuminate\Foundation\Events\Dispatchable;

class PaymentReceived
{
    use Dispatchable;

    public function __construct(
        public Payment $payment,
        public int $companyId,
    ) {}
}
