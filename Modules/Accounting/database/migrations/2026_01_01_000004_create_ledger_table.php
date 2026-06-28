<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ledger', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('company_id');
            $table->unsignedInteger('account_id');
            $table->unsignedInteger('journal_entry_id');
            $table->unsignedInteger('journal_entry_line_id');
            $table->date('date');
            $table->string('type', 10); // debit, credit
            $table->unsignedBigInteger('amount');
            $table->bigInteger('running_balance')->default(0);
            $table->timestamps();

            $table->index('company_id');
            $table->index('account_id');
            $table->index('journal_entry_id');
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger');
    }
};
