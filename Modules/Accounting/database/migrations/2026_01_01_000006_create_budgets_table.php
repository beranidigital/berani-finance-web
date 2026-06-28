<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budgets', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('company_id');
            $table->unsignedInteger('fiscal_period_id');
            $table->unsignedInteger('account_id');
            $table->unsignedBigInteger('amount');
            $table->timestamps();

            $table->index('company_id');
            $table->index('fiscal_period_id');
            $table->index('account_id');
            $table->unique(['company_id', 'fiscal_period_id', 'account_id'], 'budget_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
