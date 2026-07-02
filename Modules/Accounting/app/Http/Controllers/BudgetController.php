<?php

namespace Modules\Accounting\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Accounting\Http\Requests\StoreBudgetRequest;
use Modules\Accounting\Http\Resources\BudgetResource;
use Modules\Accounting\Models\Budget;

class BudgetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('manage-accounting');

        $budgets = Budget::whereCompany($request->header('company'))
            ->with(['account', 'fiscalPeriod'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => BudgetResource::collection($budgets),
        ]);
    }

    public function store(StoreBudgetRequest $request): JsonResponse
    {
        $this->authorize('manage-accounting');

        $budget = Budget::create([
            'company_id' => $request->header('company'),
            'fiscal_period_id' => $request->fiscal_period_id,
            'account_id' => $request->account_id,
            'amount' => $request->amount,
        ]);

        return response()->json([
            'data' => new BudgetResource($budget),
        ], 201);
    }

    public function show(Request $request, Budget $budget): JsonResponse
    {
        $this->authorize('manage-accounting');

        $budget->load(['account', 'fiscalPeriod']);

        return response()->json([
            'data' => new BudgetResource($budget),
        ]);
    }

    public function update(StoreBudgetRequest $request, Budget $budget): JsonResponse
    {
        $this->authorize('manage-accounting');

        $budget->update($request->validated());

        return response()->json([
            'data' => new BudgetResource($budget),
        ]);
    }

    public function destroy(Request $request, Budget $budget): JsonResponse
    {
        $this->authorize('manage-accounting');

        $budget->delete();

        return response()->json(null, 204);
    }
}
