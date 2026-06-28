<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_entry_lines', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('journal_entry_id');
            $table->unsignedInteger('account_id');
            $table->string('type', 10); // debit, credit
            $table->unsignedBigInteger('amount');
            $table->text('description')->nullable();
            $table->unsignedInteger('company_id');
            $table->timestamps();

            $table->index('journal_entry_id');
            $table->index('account_id');
            $table->index('company_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_entry_lines');
    }
};
