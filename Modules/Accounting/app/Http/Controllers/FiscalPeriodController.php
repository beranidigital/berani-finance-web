<?php

namespace Modules\Accounting\Http\Controllers;

use App\Http\Controllers\Controller;

class FiscalPeriodController extends Controller
{
    public function index()
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }

    public function close($id)
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }

    public function reopen($id)
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }
}
