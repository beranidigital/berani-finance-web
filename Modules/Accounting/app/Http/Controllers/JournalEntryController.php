<?php

namespace Modules\Accounting\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Accounting\Http\Requests\StoreJournalEntryRequest;
use Modules\Accounting\Http\Resources\JournalEntryResource;
use Modules\Accounting\Models\JournalEntry;
use Modules\Accounting\Services\JournalService;

class JournalEntryController extends Controller
{
    public function __construct(
        private readonly JournalService $journalService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('manage-accounting');

        $entries = JournalEntry::whereCompany($request->header('company'))
            ->with('lines.account')
            ->orderBy('id', 'desc')
            ->paginate($request->get('limit', 25));

        return response()->json([
            'data' => JournalEntryResource::collection($entries),
            'meta' => [
                'total' => $entries->total(),
                'per_page' => $entries->perPage(),
                'current_page' => $entries->currentPage(),
                'last_page' => $entries->lastPage(),
            ],
        ]);
    }

    public function store(StoreJournalEntryRequest $request): JsonResponse
    {
        $this->authorize('manage-accounting');

        try {
            $entry = $this->journalService->createEntry(
                companyId: (int) $request->header('company'),
                date: $request->date,
                description: $request->description,
                lines: $request->lines,
            );
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'data' => new JournalEntryResource($entry),
        ], 201);
    }

    public function show(Request $request, JournalEntry $journalEntry): JsonResponse
    {
        $this->authorize('manage-accounting');

        $journalEntry->load('lines.account');

        return response()->json([
            'data' => new JournalEntryResource($journalEntry),
        ]);
    }

    public function destroy(Request $request, JournalEntry $journalEntry): JsonResponse
    {
        $this->authorize('manage-accounting');

        $journalEntry->delete();

        return response()->json(null, 204);
    }

    public function reverse(Request $request, JournalEntry $journalEntry): JsonResponse
    {
        $this->authorize('manage-accounting');

        try {
            $reversal = $this->journalService->reverseEntry($journalEntry);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'data' => new JournalEntryResource($reversal),
        ], 201);
    }
}
