<?php

namespace Modules\Accounting\Http\Controllers;

use App\Http\Controllers\Controller;

class JournalEntryController extends Controller
{
    public function index()
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }

    public function reverse($id)
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }
}
