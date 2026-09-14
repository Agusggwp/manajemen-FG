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
            $table->string('mua_location_name')->nullable()->after('location_notes');
            $table->text('mua_location_address')->nullable()->after('mua_location_name');
            $table->decimal('mua_latitude', 10, 8)->nullable()->after('mua_location_address');
            $table->decimal('mua_longitude', 11, 8)->nullable()->after('mua_latitude');
            $table->integer('mua_location_radius')->default(100)->nullable()->after('mua_longitude');
            $table->text('mua_location_notes')->nullable()->after('mua_location_radius');
            $table->boolean('mua_same_as_shooting_location')->default(true)->after('mua_location_notes');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->string('mua_location_name')->nullable()->after('location_radius');
            $table->text('mua_location_address')->nullable()->after('mua_location_name');
            $table->decimal('mua_latitude', 10, 8)->nullable()->after('mua_location_address');
            $table->decimal('mua_longitude', 11, 8)->nullable()->after('mua_latitude');
            $table->integer('mua_location_radius')->default(100)->nullable()->after('mua_longitude');
            $table->text('mua_location_notes')->nullable()->after('mua_location_radius');
            $table->boolean('mua_same_as_shooting_location')->default(true)->after('mua_location_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn([
                'mua_location_name',
                'mua_location_address',
                'mua_latitude',
                'mua_longitude',
                'mua_location_radius',
                'mua_location_notes',
                'mua_same_as_shooting_location',
            ]);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'mua_location_name',
                'mua_location_address',
                'mua_latitude',
                'mua_longitude',
                'mua_location_radius',
                'mua_location_notes',
                'mua_same_as_shooting_location',
            ]);
        });
    }
};
