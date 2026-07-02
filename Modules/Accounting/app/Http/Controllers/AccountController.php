<?php

namespace Modules\Accounting\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Accounting\Http\Requests\StoreAccountRequest;
use Modules\Accounting\Http\Requests\UpdateAccountRequest;
use Modules\Accounting\Http\Resources\AccountResource;
use Modules\Accounting\Models\Account;
use Modules\Accounting\Services\AccountService;

class AccountController extends Controller
{
    public function __construct(
        private readonly AccountService $accountService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('manage-accounting');

        $accounts = Account::whereCompany($request->header('company'))
            ->withCount('children')
            ->orderBy('code')
            ->get();

        return response()->json([
            'data' => AccountResource::collection($accounts),
        ]);
    }

    public function store(StoreAccountRequest $request): JsonResponse
    {
        $this->authorize('manage-accounting');

        $account = $this->accountService->create([
            'company_id' => $request->header('company'),
            'name' => $request->name,
            'code' => $request->code,
            'type' => $request->type,
            'parent_id' => $request->parent_id,
            'description' => $request->description,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return response()->json([
            'data' => new AccountResource($account),
        ], 201);
    }

    public function show(Request $request, Account $account): JsonResponse
    {
        $this->authorize('manage-accounting');

        $account->loadCount('children');

        return response()->json([
            'data' => new AccountResource($account),
        ]);
    }

    public function update(UpdateAccountRequest $request, Account $account): JsonResponse
    {
        $this->authorize('manage-accounting');

        $account = $this->accountService->update($account, $request->validated());

        return response()->json([
            'data' => new AccountResource($account),
        ]);
    }

    public function destroy(Request $request, Account $account): JsonResponse
    {
        $this->authorize('manage-accounting');

        try {
            $this->accountService->delete($account);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(null, 204);
    }
}
