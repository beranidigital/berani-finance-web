<?php

namespace Modules\Accounting\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Accounting\Models\Account;

class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition(): array
    {
        return [
            'company_id' => 1,
            'name' => $this->faker->word(),
            'code' => (string) $this->faker->unique()->numberBetween(1000, 9999),
            'type' => $this->faker->randomElement(['asset', 'liability', 'equity', 'revenue', 'expense']),
            'is_active' => true,
            'is_system' => false,
        ];
    }
}
