<?php

namespace Modules\Accounting\Services;

use Modules\Accounting\Models\FiscalPeriod;

class FiscalPeriodService
{
    public function create(int $companyId, string $name, string $startDate, string $endDate): FiscalPeriod
    {
        return FiscalPeriod::create([
            'company_id' => $companyId,
            'name' => $name,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }

    public function close(FiscalPeriod $period): void
    {
        if ($period->is_closed) {
            throw new \InvalidArgumentException('Fiscal period is already closed.');
        }

        $period->close();
    }

    public function reopen(FiscalPeriod $period): void
    {
        if (! $period->is_closed) {
            throw new \InvalidArgumentException('Fiscal period is already open.');
        }

        $period->reopen();
    }

    public function getCurrentPeriod(int $companyId): ?FiscalPeriod
    {
        return FiscalPeriod::whereCompany($companyId)
            ->forDate(now()->format('Y-m-d'))
            ->first();
    }
}
