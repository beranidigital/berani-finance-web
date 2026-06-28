<?php

namespace Modules\Accounting\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Accounting\Http\Resources\LedgerResource;
use Modules\Accounting\Models\Account;
use Modules\Accounting\Models\Ledger;

class LedgerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('manage accounting');

        $query = Ledger::whereCompany($request->header('company'))
            ->with('account');

        if ($request->has('account_id')) {
            $query->forAccount($request->account_id);
        }

        if ($request->has('from_date') && $request->has('to_date')) {
            $query->forDateRange($request->from_date, $request->to_date);
        }

        $entries = $query->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($request->get('limit', 50));

        return response()->json([
            'data' => LedgerResource::collection($entries),
            'meta' => [
                'total' => $entries->total(),
                'per_page' => $entries->perPage(),
                'current_page' => $entries->currentPage(),
                'last_page' => $entries->lastPage(),
            ],
        ]);
    }
}
