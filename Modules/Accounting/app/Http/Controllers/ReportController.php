<?php

namespace Modules\Accounting\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Accounting\Services\ReportService;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportService $reportService,
    ) {}

    public function trialBalance(Request $request): JsonResponse
    {
        $this->authorize('manage accounting');

        $result = $this->reportService->trialBalance(
            companyId: (int) $request->header('company'),
            asOfDate: $request->get('as_of_date'),
        );

        return response()->json(['data' => $result]);
    }

    public function balanceSheet(Request $request): JsonResponse
    {
        $this->authorize('manage accounting');

        $result = $this->reportService->balanceSheet(
            companyId: (int) $request->header('company'),
            asOfDate: $request->get('as_of_date'),
        );

        return response()->json(['data' => $result]);
    }

    public function incomeStatement(Request $request): JsonResponse
    {
        $this->authorize('manage accounting');

        $result = $this->reportService->incomeStatement(
            companyId: (int) $request->header('company'),
            startDate: $request->get('start_date', now()->startOfYear()->format('Y-m-d')),
            endDate: $request->get('end_date', now()->format('Y-m-d')),
        );

        return response()->json(['data' => $result]);
    }

    public function cashFlow(Request $request): JsonResponse
    {
        $this->authorize('manage accounting');

        $result = $this->reportService->cashFlow(
            companyId: (int) $request->header('company'),
            startDate: $request->get('start_date', now()->startOfYear()->format('Y-m-d')),
            endDate: $request->get('end_date', now()->format('Y-m-d')),
        );

        return response()->json(['data' => $result]);
    }

    public function arAging(Request $request): JsonResponse
    {
        $this->authorize('manage accounting');

        $result = $this->reportService->arAging(
            companyId: (int) $request->header('company'),
            asOfDate: $request->get('as_of_date', now()->format('Y-m-d')),
        );

        return response()->json(['data' => $result]);
    }

    public function apAging(Request $request): JsonResponse
    {
        $this->authorize('manage accounting');

        $result = $this->reportService->apAging(
            companyId: (int) $request->header('company'),
            asOfDate: $request->get('as_of_date', now()->format('Y-m-d')),
        );

        return response()->json(['data' => $result]);
    }
}
