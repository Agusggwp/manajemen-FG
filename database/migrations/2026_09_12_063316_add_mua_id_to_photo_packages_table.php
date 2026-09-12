<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('photo_packages', function (Blueprint $table) {
            $table->foreignId('mua_id')->nullable()->after('includes_mua')->constrained('muas')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('photo_packages', function (Blueprint $table) {
            $table->dropForeign(['mua_id']);
            $table->dropColumn('mua_id');
        });
    }
};
