<?php

namespace Modules\Accounting\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Accounting\Models\Account;

class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition(): array
    {
        $types = ['asset', 'liability', 'equity', 'revenue', 'expense'];

        return [
            'company_id' => 1,
            'name' => fake()->name(),
            'code' => (string) fake()->unique()->randomNumber(4),
            'type' => $types[array_rand($types)],
            'is_active' => true,
            'is_system' => false,
        ];
    }
}
