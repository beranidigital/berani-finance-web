<?php

namespace Modules\Accounting\Http\Controllers;

use App\Http\Controllers\Controller;

class LedgerController extends Controller
{
    public function index()
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }
}
