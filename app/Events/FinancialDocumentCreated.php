<?php

namespace App\Events;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;

class FinancialDocumentCreated
{
    use Dispatchable;

    public function __construct(
        public Model $model,
        public int $companyId,
    ) {}
}
