<?php

namespace Modules\Accounting\Http\Controllers;

use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function trialBalance()
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }

    public function balanceSheet()
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }

    public function incomeStatement()
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }

    public function cashFlow()
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }

    public function arAging()
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }

    public function apAging()
    {
        $this->authorize('manage accounting');

        return response()->json(['data' => []]);
    }
}
