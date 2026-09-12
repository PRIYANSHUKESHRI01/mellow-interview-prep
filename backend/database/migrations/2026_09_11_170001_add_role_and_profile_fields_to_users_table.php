<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['user', 'admin_internal', 'admin_tpo', 'superadmin'])
                ->default('user')
                ->after('email');
            $table->string('handle')->nullable()->unique()->after('role');
            $table->foreignId('college_id')->nullable()->after('handle')
                ->constrained('colleges')->nullOnDelete();
            $table->boolean('is_blocked')->default(false)->after('college_id');
            $table->timestamp('blocked_at')->nullable()->after('is_blocked');
            $table->string('blocked_reason')->nullable()->after('blocked_at');
            $table->foreignId('blocked_by')->nullable()->after('blocked_reason')
                ->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('blocked_by');
            $table->dropConstrainedForeignId('college_id');
            $table->dropColumn(['role', 'handle', 'is_blocked', 'blocked_at', 'blocked_reason']);
        });
    }
};
