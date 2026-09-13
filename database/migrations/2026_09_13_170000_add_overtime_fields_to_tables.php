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
        Schema::table('bookings', function (Blueprint $table) {
            $table->integer('overtime_hours')->default(0)->after('package_includes_mua');
            $table->decimal('overtime_fee', 12, 2)->default(0)->after('overtime_hours');
        });

        Schema::table('schedules', function (Blueprint $table) {
            $table->integer('overtime_hours')->default(0)->after('end_time');
            $table->decimal('overtime_fee', 12, 2)->default(0)->after('overtime_hours');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->integer('overtime_hours')->default(0)->after('package_includes_mua');
            $table->decimal('overtime_fee', 12, 2)->default(0)->after('overtime_hours');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['overtime_hours', 'overtime_fee']);
        });

        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn(['overtime_hours', 'overtime_fee']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['overtime_hours', 'overtime_fee']);
        });
    }
};
