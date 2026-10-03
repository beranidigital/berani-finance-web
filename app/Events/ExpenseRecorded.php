<?php

namespace App\Events;

use App\Domains\Purchases\Models\Expense;
use Illuminate\Foundation\Events\Dispatchable;

class ExpenseRecorded
{
    use Dispatchable;

    public function __construct(
        public Expense $expense,
        public int $companyId,
    ) {}
}
