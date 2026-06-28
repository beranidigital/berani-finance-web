<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_entries', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('company_id');
            $table->string('entry_number', 50);
            $table->date('date');
            $table->text('description')->nullable();
            $table->string('reference_type', 50)->nullable(); // invoice, payment, expense, estimate
            $table->unsignedInteger('reference_id')->nullable();
            $table->unsignedInteger('created_by');
            $table->boolean('is_balanced')->default(false);
            $table->timestamp('posted_at')->nullable();
            $table->timestamps();

            $table->index('company_id');
            $table->index('reference_id');
            $table->index('reference_type');
            $table->index('date');
            $table->unique(['company_id', 'entry_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_entries');
    }
};
