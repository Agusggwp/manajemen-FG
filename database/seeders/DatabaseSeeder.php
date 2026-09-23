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

        // Default MUA Packages
        PhotoPackage::create([
            'name' => 'Paket MUA Wisuda / Graduation Glam',
            'category' => 'MUA Only',
            'price' => 350000,
            'duration_minutes' => 90,
            'number_of_photos' => 0,
            'number_of_photographers' => 0,
            'includes_mua' => true,
            'estimated_photographer_cost' => 0,
            'estimated_mua_fee' => 250000,
            'estimated_operational_cost' => 25000,
            'description' => 'Layanan rias wajah & hair styling / hijab khusus wisuda tanpa fotografer. Tampil percaya diri dengan riasan awet, natural glam, dan flawless.',
            'features' => [
                'Makeup Natural Glam Flawless & Tahan Seharian',
                'Hairdo Elegan atau Hijab Styling Modern',
                'Free Pemasangan Softlens & Bulu Mata Premium',
                'Free Setting Spray & Touch Up Kit Mini',
            ],
            'status' => 'ACTIVE',
        ]);

        PhotoPackage::create([
            'name' => 'Paket MUA Prewedding / Engagement Look',
            'category' => 'MUA Only',
            'price' => 750000,
            'duration_minutes' => 120,
            'number_of_photos' => 0,
            'number_of_photographers' => 0,
            'includes_mua' => true,
            'estimated_photographer_cost' => 0,
            'estimated_mua_fee' => 500000,
            'estimated_operational_cost' => 50000,
            'description' => 'Layanan rias wajah profesional untuk prewedding outdoor / engagement / lamaran tanpa fotografer. Cocok untuk sesi mandiri atau acara keluarga.',
            'features' => [
                'High-End Cosmetic Complexion Tahan Seharian & Keringat',
                'Hair Styling atau Hijab Do Khusus Prewedding',
                '1x Touch Up / Ganti Warna Lipstik saat Sesi',
                'Pemasangan Aksesoris Rambut / Headpiece Simpel',
            ],
            'status' => 'ACTIVE',
        ]);

        PhotoPackage::create([
            'name' => 'Paket MUA Bridal / Akad Nikah Signature',
            'category' => 'MUA Only',
            'price' => 1500000,
            'duration_minutes' => 180,
            'number_of_photos' => 0,
            'number_of_photographers' => 0,
            'includes_mua' => true,
            'estimated_photographer_cost' => 0,
            'estimated_mua_fee' => 1000000,
            'estimated_operational_cost' => 100000,
            'description' => 'Paket rias pengantin eksklusif untuk akad nikah atau resepsi tanpa paket dokumentasi foto ARTDEVATA. Dikerjakan oleh MUA profesional berpengalaman.',
            'features' => [
                'Luxury HD Bridal Makeup & Complexion Tahan Seharian',
                'Sanggul Modern / Hairdo Pengantin / Hijab Styling Mewah',
                'Pemasangan Melati Segar / Mahkota / Veil Pengantin',
                'Standby Pendampingan Touch Up Selama Acara Inti',
            ],
            'status' => 'ACTIVE',
        ]);
    }
}
