<?php

namespace App\Traits;

use App\Events\FinancialDocumentCreated;
use App\Events\FinancialDocumentDeleted;
use App\Events\FinancialDocumentUpdated;

trait HasAccountingHooks
{
    public static function bootHasAccountingHooks(): void
    {
        static::created(function ($model) {
            FinancialDocumentCreated::dispatch($model, $model->company_id);
        });

        static::updated(function ($model) {
            if ($model->wasChanged()) {
                FinancialDocumentUpdated::dispatch(
                    $model,
                    $model->company_id,
                    $model->getOriginal(),
                    $model->getChanges(),
                );
            }
        });

        static::deleted(function ($model) {
            FinancialDocumentDeleted::dispatch(
                $model,
                $model->company_id,
                get_class($model),
                $model->id,
            );
        });
    }
}
