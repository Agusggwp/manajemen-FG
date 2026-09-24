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
        Schema::table('schedules', function (Blueprint $table) {
            if (!Schema::hasColumn('schedules', 'mua_location_name')) {
                $table->string('mua_location_name')->nullable()->after('location_notes');
            }
            if (!Schema::hasColumn('schedules', 'mua_location_address')) {
                $table->text('mua_location_address')->nullable()->after('mua_location_name');
            }
            if (!Schema::hasColumn('schedules', 'mua_latitude')) {
                $table->decimal('mua_latitude', 10, 8)->nullable()->after('mua_location_address');
            }
            if (!Schema::hasColumn('schedules', 'mua_longitude')) {
                $table->decimal('mua_longitude', 11, 8)->nullable()->after('mua_latitude');
            }
            if (!Schema::hasColumn('schedules', 'mua_location_radius')) {
                $table->integer('mua_location_radius')->default(100)->nullable()->after('mua_longitude');
            }
            if (!Schema::hasColumn('schedules', 'mua_location_notes')) {
                $table->text('mua_location_notes')->nullable()->after('mua_location_radius');
            }
            if (!Schema::hasColumn('schedules', 'mua_same_as_shooting_location')) {
                $table->boolean('mua_same_as_shooting_location')->default(true)->after('mua_location_notes');
            }
        });

        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'mua_location_name')) {
                $table->string('mua_location_name')->nullable()->after('location_radius');
            }
            if (!Schema::hasColumn('projects', 'mua_location_address')) {
                $table->text('mua_location_address')->nullable()->after('mua_location_name');
            }
            if (!Schema::hasColumn('projects', 'mua_latitude')) {
                $table->decimal('mua_latitude', 10, 8)->nullable()->after('mua_location_address');
            }
            if (!Schema::hasColumn('projects', 'mua_longitude')) {
                $table->decimal('mua_longitude', 11, 8)->nullable()->after('mua_latitude');
            }
            if (!Schema::hasColumn('projects', 'mua_location_radius')) {
                $table->integer('mua_location_radius')->default(100)->nullable()->after('mua_longitude');
            }
            if (!Schema::hasColumn('projects', 'mua_location_notes')) {
                $table->text('mua_location_notes')->nullable()->after('mua_location_radius');
            }
            if (!Schema::hasColumn('projects', 'mua_same_as_shooting_location')) {
                $table->boolean('mua_same_as_shooting_location')->default(true)->after('mua_location_notes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $columns = [
            'mua_location_name',
            'mua_location_address',
            'mua_latitude',
            'mua_longitude',
            'mua_location_radius',
            'mua_location_notes',
            'mua_same_as_shooting_location',
        ];

        Schema::table('schedules', function (Blueprint $table) use ($columns) {
            $existing = array_filter($columns, fn($col) => Schema::hasColumn('schedules', $col));
            if (!empty($existing)) {
                $table->dropColumn($existing);
            }
        });

        Schema::table('projects', function (Blueprint $table) use ($columns) {
            $existing = array_filter($columns, fn($col) => Schema::hasColumn('projects', $col));
            if (!empty($existing)) {
                $table->dropColumn($existing);
            }
        });
    }
};
