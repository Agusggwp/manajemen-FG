<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Mua;
use App\Models\MuaProjectFee;
use App\Models\PhotoPackage;
use App\Models\PhotographerProjectSalary;
use App\Models\PhotoSessionProof;
use App\Models\Portfolio;
use App\Models\Project;
use App\Models\ProjectExpense;
use App\Models\ProjectGallery;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Clear old records safely
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        ActivityLog::truncate();
        PhotoSessionProof::truncate();
        ProjectExpense::truncate();
        MuaProjectFee::truncate();
        PhotographerProjectSalary::truncate();
        ProjectGallery::truncate();
        DB::table('project_photographers')->truncate();
        DB::table('project_muas')->truncate();
        Project::truncate();
        Schedule::truncate();
        Booking::truncate();
        PhotoPackage::truncate();
        Customer::truncate();
        Mua::truncate();
        Portfolio::truncate();
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Create 1 Admin only
        User::create([
            'name' => 'Admin ARTDEVATA',
            'email' => 'admin@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'phone' => '081234567890',
            'status' => 'ACTIVE',
        ]);
    }
}
