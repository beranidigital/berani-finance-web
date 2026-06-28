<?php

namespace Modules\Accounting\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChartOfAccountsSeeder extends Seeder
{
    public function run(int $companyId): void
    {
        $accounts = [
            // Assets (1000-1999)
            ['company_id' => $companyId, 'code' => '1000', 'name' => 'Assets', 'type' => 'asset', 'parent_id' => null, 'is_system' => true],
            ['company_id' => $companyId, 'code' => '1100', 'name' => 'Cash', 'type' => 'asset', 'parent_id' => null, 'is_system' => true],
            ['company_id' => $companyId, 'code' => '1200', 'name' => 'Accounts Receivable', 'type' => 'asset', 'parent_id' => null, 'is_system' => true],

            // Liabilities (2000-2999)
            ['company_id' => $companyId, 'code' => '2000', 'name' => 'Liabilities', 'type' => 'liability', 'parent_id' => null, 'is_system' => true],
            ['company_id' => $companyId, 'code' => '2100', 'name' => 'Accounts Payable', 'type' => 'liability', 'parent_id' => null, 'is_system' => true],
            ['company_id' => $companyId, 'code' => '2200', 'name' => 'Tax Payable', 'type' => 'liability', 'parent_id' => null, 'is_system' => true],

            // Equity (3000-3999)
            ['company_id' => $companyId, 'code' => '3000', 'name' => 'Equity', 'type' => 'equity', 'parent_id' => null, 'is_system' => true],
            ['company_id' => $companyId, 'code' => '3100', 'name' => 'Retained Earnings', 'type' => 'equity', 'parent_id' => null, 'is_system' => true],
            ['company_id' => $companyId, 'code' => '3200', 'name' => 'Current Year Earnings', 'type' => 'equity', 'parent_id' => null, 'is_system' => true],

            // Revenue (4000-4999)
            ['company_id' => $companyId, 'code' => '4000', 'name' => 'Revenue', 'type' => 'revenue', 'parent_id' => null, 'is_system' => true],
            ['company_id' => $companyId, 'code' => '4100', 'name' => 'Sales Revenue', 'type' => 'revenue', 'parent_id' => null, 'is_system' => true],

            // Expenses (5000-5999)
            ['company_id' => $companyId, 'code' => '5000', 'name' => 'Expenses', 'type' => 'expense', 'parent_id' => null, 'is_system' => true],
            ['company_id' => $companyId, 'code' => '5100', 'name' => 'Cost of Goods Sold', 'type' => 'expense', 'parent_id' => null, 'is_system' => true],
            ['company_id' => $companyId, 'code' => '5200', 'name' => 'Operating Expenses', 'type' => 'expense', 'parent_id' => null, 'is_system' => true],
        ];

        DB::table('accounts')->insert($accounts);
    }
}
