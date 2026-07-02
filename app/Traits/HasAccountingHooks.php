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
            if ($model->company_id !== null) {
                FinancialDocumentCreated::dispatch($model, $model->company_id);
            }
        });

        static::updated(function ($model) {
            if ($model->company_id !== null && $model->wasChanged()) {
                FinancialDocumentUpdated::dispatch(
                    $model,
                    $model->company_id,
                    $model->getOriginal(),
                    $model->getChanges(),
                );
            }
        });

        static::deleted(function ($model) {
            if ($model->company_id !== null) {
                FinancialDocumentDeleted::dispatch(
                    $model,
                    $model->company_id,
                    get_class($model),
                    $model->id,
                );
            }
        });
    }
}
