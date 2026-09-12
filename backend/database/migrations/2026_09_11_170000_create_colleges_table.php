<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('colleges', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('short_code')->unique();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->enum('tier', ['Academic Enterprise', 'Pro Campus', 'Standard'])->default('Standard');
            $table->decimal('placement_rate', 5, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('colleges');
    }
};
