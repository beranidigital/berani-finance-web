<?php

namespace App\Services\Ai\Tools;

use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Payment;
use Carbon\Carbon;

/**
 * Aggregate stats for the current company over a time window.
 *
 * Use this when the user asks "how much did we make/spend/invoice in <period>".
 * Much cheaper than fetching full invoice lists and summing client-side.
 */
class GetCompanyStatsTool extends AiTool
{
    private const PERIODS = [
        'today',
        'this_week',
        'this_month',
        'last_month',
        'this_quarter',
        'this_year',
        'last_year',
    ];

    public function name(): string
    {
        return 'get_company_stats';
    }

    public function description(): string
    {
        return "Aggregate stats for the current company over a named time period: invoice count and total, payment count and total, expense count and total. Use this for 'how much did we earn/spend' questions.";
    }

    public function parameterSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'period' => [
                    'type' => 'string',
                    'enum' => self::PERIODS,
                    'description' => 'Named time window.',
                ],
            ],
            'required' => ['period'],
        ];
    }

    public function execute(array $arguments, int $companyId, int $userId): mixed
    {
        $period = (string) ($arguments['period'] ?? 'this_month');
        if (! in_array($period, self::PERIODS, true)) {
            return ['error' => 'invalid_period', 'valid' => self::PERIODS];
        }

        [$start, $end] = $this->rangeFor($period);

        $invoiceCount = Invoice::query()
            ->where('company_id', $companyId)
            ->whereBetween('invoice_date', [$start, $end])
            ->count();

        $invoiceTotal = (float) Invoice::query()
            ->where('company_id', $companyId)
            ->whereBetween('invoice_date', [$start, $end])
            ->sum('total');

        $paymentCount = Payment::query()
            ->where('company_id', $companyId)
            ->whereBetween('payment_date', [$start, $end])
            ->count();

        $paymentTotal = (float) Payment::query()
            ->where('company_id', $companyId)
            ->whereBetween('payment_date', [$start, $end])
            ->sum('amount');

        $expenseCount = Expense::query()
            ->where('company_id', $companyId)
            ->whereBetween('expense_date', [$start, $end])
            ->count();

        $expenseTotal = (float) Expense::query()
            ->where('company_id', $companyId)
            ->whereBetween('expense_date', [$start, $end])
            ->sum('amount');

        return [
            'period' => $period,
            'start' => $start->toDateString(),
            'end' => $end->toDateString(),
            'invoices' => ['count' => $invoiceCount, 'total' => $invoiceTotal],
            'payments' => ['count' => $paymentCount, 'total' => $paymentTotal],
            'expenses' => ['count' => $expenseCount, 'total' => $expenseTotal],
        ];
    }

    /**
     * @return array{0: Carbon, 1: Carbon}
     */
    private function rangeFor(string $period): array
    {
        $now = Carbon::now();

        return match ($period) {
            'today' => [$now->copy()->startOfDay(), $now->copy()->endOfDay()],
            'this_week' => [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()],
            'this_month' => [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()],
            'last_month' => [
                $now->copy()->subMonthNoOverflow()->startOfMonth(),
                $now->copy()->subMonthNoOverflow()->endOfMonth(),
            ],
            'this_quarter' => [$now->copy()->startOfQuarter(), $now->copy()->endOfQuarter()],
            'this_year' => [$now->copy()->startOfYear(), $now->copy()->endOfYear()],
            'last_year' => [
                $now->copy()->subYearNoOverflow()->startOfYear(),
                $now->copy()->subYearNoOverflow()->endOfYear(),
            ],
        };
    }
}
