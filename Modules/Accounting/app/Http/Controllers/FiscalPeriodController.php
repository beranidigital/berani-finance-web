<?php

namespace Modules\Accounting\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Accounting\Http\Requests\StoreFiscalPeriodRequest;
use Modules\Accounting\Http\Resources\FiscalPeriodResource;
use Modules\Accounting\Models\FiscalPeriod;
use Modules\Accounting\Services\FiscalPeriodService;

class FiscalPeriodController extends Controller
{
    public function __construct(
        private readonly FiscalPeriodService $fiscalPeriodService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('manage accounting');

        $periods = FiscalPeriod::whereCompany($request->header('company'))
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json([
            'data' => FiscalPeriodResource::collection($periods),
        ]);
    }

    public function store(StoreFiscalPeriodRequest $request): JsonResponse
    {
        $this->authorize('manage accounting');

        $period = $this->fiscalPeriodService->create(
            companyId: (int) $request->header('company'),
            name: $request->name,
            startDate: $request->start_date,
            endDate: $request->end_date,
        );

        return response()->json([
            'data' => new FiscalPeriodResource($period),
        ], 201);
    }

    public function show(Request $request, FiscalPeriod $fiscalPeriod): JsonResponse
    {
        $this->authorize('manage accounting');

        return response()->json([
            'data' => new FiscalPeriodResource($fiscalPeriod),
        ]);
    }

    public function update(StoreFiscalPeriodRequest $request, FiscalPeriod $fiscalPeriod): JsonResponse
    {
        $this->authorize('manage accounting');

        $fiscalPeriod->update($request->validated());

        return response()->json([
            'data' => new FiscalPeriodResource($fiscalPeriod),
        ]);
    }

    public function destroy(Request $request, FiscalPeriod $fiscalPeriod): JsonResponse
    {
        $this->authorize('manage accounting');

        $fiscalPeriod->delete();

        return response()->json(null, 204);
    }

    public function close(Request $request, FiscalPeriod $fiscalPeriod): JsonResponse
    {
        $this->authorize('manage accounting');

        try {
            $this->fiscalPeriodService->close($fiscalPeriod);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'data' => new FiscalPeriodResource($fiscalPeriod),
        ]);
    }

    public function reopen(Request $request, FiscalPeriod $fiscalPeriod): JsonResponse
    {
        $this->authorize('manage accounting');

        try {
            $this->fiscalPeriodService->reopen($fiscalPeriod);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'data' => new FiscalPeriodResource($fiscalPeriod),
        ]);
    }
}
