<?php

namespace App\Events;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;

class FinancialDocumentUpdated
{
    use Dispatchable;

    public function __construct(
        public Model $model,
        public int $companyId,
        public array $oldData,
        public array $newData,
    ) {}
}
