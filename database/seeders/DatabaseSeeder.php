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
use App\Models\Project;
use App\Models\ProjectExpense;
use App\Models\ProjectGallery;
use App\Models\Schedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

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
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Create Users (Admin & Photographers)
        $admin = User::create([
            'name' => 'Admin ARTDEVATA',
            'email' => 'admin@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'phone' => '081234567890',
            'status' => 'ACTIVE',
        ]);

        $photographerAgus = User::create([
            'name' => 'Agus Photography',
            'email' => 'agus@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'PHOTOGRAPHER',
            'phone' => '081298765432',
            'specialty' => 'Graduation & Event Specialist',
            'bio' => 'Senior Lead Photographer ARTDEVATA Bali',
            'status' => 'ACTIVE',
        ]);

        $photographerBudi = User::create([
            'name' => 'Budi Pratama',
            'email' => 'budi@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'PHOTOGRAPHER',
            'phone' => '081345678901',
            'specialty' => 'Wedding & Prewedding Specialist',
            'bio' => 'Wedding Visual Creator with 8+ years experience',
            'status' => 'ACTIVE',
        ]);

        $photographerCitra = User::create([
            'name' => 'Citra Dewi',
            'email' => 'citra@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'PHOTOGRAPHER',
            'phone' => '081456789012',
            'specialty' => 'Portrait & Commercial Specialist',
            'bio' => 'Creative Fashion & Product Photographer',
            'status' => 'ACTIVE',
        ]);

        $photographerDika = User::create([
            'name' => 'Dika Wibawa',
            'email' => 'dika@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'PHOTOGRAPHER',
            'phone' => '081567890123',
            'specialty' => 'Drone & Cinematic Landscape',
            'bio' => 'Aerial & Architectural Photography Specialist',
            'status' => 'ACTIVE',
        ]);

        // 2. Create MUAs (and their User login accounts)
        $userMuaSari = User::create([
            'name' => 'Sari Makeup Artistry',
            'email' => 'sari@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'MUA',
            'phone' => '087890123456',
            'address' => 'Jl. Tukad Yeh Aya No. 88, Renon, Denpasar',
            'specialty' => 'Graduation & Soft Glam Makeup',
            'bio' => 'Professional Makeup Artist specializing in graduation, photoshoot, and prewedding looks.',
            'status' => 'ACTIVE',
            'email_verified_at' => now(),
        ]);

        $muaSari = Mua::create([
            'user_id' => $userMuaSari->id,
            'name' => 'Sari Makeup Artistry',
            'email' => 'sari@artdevata.com',
            'phone' => '087890123456',
            'address' => 'Jl. Tukad Yeh Aya No. 88, Renon, Denpasar',
            'specialty' => 'Graduation & Soft Glam Makeup',
            'bio' => 'Professional Makeup Artist specializing in graduation, photoshoot, and prewedding looks.',
            'status' => 'ACTIVE',
            'default_fee' => 250000,
        ]);

        $userMuaDewi = User::create([
            'name' => 'Dewi Bridal Makeup',
            'email' => 'dewi@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'MUA',
            'phone' => '087812345678',
            'address' => 'Jl. Sunset Road No. 102, Kuta, Badung',
            'specialty' => 'Traditional Bali & International Bridal',
            'bio' => 'Senior Bridal & Wedding MUA with 10+ years experience in Bali.',
            'status' => 'ACTIVE',
            'email_verified_at' => now(),
        ]);

        $muaDewi = Mua::create([
            'user_id' => $userMuaDewi->id,
            'name' => 'Dewi Bridal Makeup',
            'email' => 'dewi@artdevata.com',
            'phone' => '087812345678',
            'address' => 'Jl. Sunset Road No. 102, Kuta, Badung',
            'specialty' => 'Traditional Bali & International Bridal',
            'bio' => 'Senior Bridal & Wedding MUA with 10+ years experience in Bali.',
            'status' => 'ACTIVE',
            'default_fee' => 450000,
        ]);

        $userMuaNia = User::create([
            'name' => 'Nia Beauty Studio',
            'email' => 'nia@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'MUA',
            'phone' => '087823456789',
            'address' => 'Jl. Raya Ubud No. 45, Gianyar',
            'specialty' => 'Natural Outdoor & High Fashion Makeup',
            'bio' => 'Editorial & Natural Sun-Kissed Makeup Artist.',
            'status' => 'ACTIVE',
            'email_verified_at' => now(),
        ]);

        $muaNia = Mua::create([
            'user_id' => $userMuaNia->id,
            'name' => 'Nia Beauty Studio',
            'email' => 'nia@artdevata.com',
            'phone' => '087823456789',
            'address' => 'Jl. Raya Ubud No. 45, Gianyar',
            'specialty' => 'Natural Outdoor & High Fashion Makeup',
            'bio' => 'Editorial & Natural Sun-Kissed Makeup Artist.',
            'status' => 'ACTIVE',
            'default_fee' => 300000,
        ]);

        // 3. Create Master Photo Packages
        $pkgBasicGrad = PhotoPackage::create([
            'name' => 'Basic Graduation',
            'category' => 'Graduation',
            'price' => 650000,
            'duration_minutes' => 60,
            'number_of_photos' => 25,
            'number_of_photographers' => 1,
            'includes_mua' => false,
            'estimated_photographer_cost' => 250000,
            'estimated_mua_fee' => 0,
            'estimated_operational_cost' => 50000,
            'description' => 'Paket wisuda ekonomis dengan 1 photographer berpengalaman.',
            'features' => ['1 Photographer', 'Durasi 60 Menit', '25 Edited Photos', 'All High-Res Raw Photos'],
            'status' => 'ACTIVE',
        ]);

        $pkgSigGrad = PhotoPackage::create([
            'name' => 'Signature Graduation',
            'category' => 'Graduation',
            'price' => 950000,
            'duration_minutes' => 90,
            'number_of_photos' => 45,
            'number_of_photographers' => 1,
            'includes_mua' => true,
            'mua_id' => $muaSari->id,
            'estimated_photographer_cost' => 300000,
            'estimated_mua_fee' => 250000,
            'estimated_operational_cost' => 50000,
            'description' => 'Paket wisuda favorit termasuk Rias Make Up Artist profesional.',
            'features' => ['1 Photographer', 'Termasuk MUA Profesional', 'Durasi 90 Menit', '45 Edited Photos', 'Cetak 10R Frame Minimalis'],
            'status' => 'ACTIVE',
        ]);

        $pkgWedBasic = PhotoPackage::create([
            'name' => 'Wedding Intimate Classic',
            'category' => 'Wedding',
            'price' => 3800000,
            'duration_minutes' => 240,
            'number_of_photos' => 150,
            'number_of_photographers' => 2,
            'includes_mua' => true,
            'mua_id' => $muaDewi->id,
            'estimated_photographer_cost' => 1200000,
            'estimated_mua_fee' => 600000,
            'estimated_operational_cost' => 250000,
            'description' => 'Dokumentasi resepsi & pemberkatan pernikahan intimate.',
            'features' => ['2 Photographers', 'Termasuk MUA Pengantin', 'Durasi 4 Jam', 'Album Cetak Photobook 20R', 'Flashdisk Wood Box'],
            'status' => 'ACTIVE',
        ]);

        $pkgPrewedBasic = PhotoPackage::create([
            'name' => 'Prewedding Bali Destination',
            'category' => 'Prewedding',
            'price' => 2500000,
            'duration_minutes' => 180,
            'number_of_photos' => 80,
            'number_of_photographers' => 1,
            'includes_mua' => true,
            'mua_id' => $muaNia->id,
            'estimated_photographer_cost' => 700000,
            'estimated_mua_fee' => 400000,
            'estimated_operational_cost' => 150000,
            'description' => 'Foto prewedding outdoor di lokasi eksotis Bali (Pantai/Kintamani).',
            'features' => ['1 Senior Photographer', 'Termasuk MUA & Touchup', '2 Lokasi Pemotretan Outdoor', '80 High-Res Edited Photos'],
            'status' => 'ACTIVE',
        ]);

        $pkgPortrait = PhotoPackage::create([
            'name' => 'Personal Portrait Studio',
            'category' => 'Portrait',
            'price' => 800000,
            'duration_minutes' => 60,
            'number_of_photos' => 20,
            'number_of_photographers' => 1,
            'includes_mua' => false,
            'estimated_photographer_cost' => 250000,
            'estimated_mua_fee' => 0,
            'estimated_operational_cost' => 50000,
            'description' => 'Sesi foto personal branding, photoshoot model & katalog.',
            'features' => ['1 Photographer', 'Studio Lighting Setup', '20 Edited Photos', 'All Raw Files'],
            'status' => 'ACTIVE',
        ]);

        // 4. Create Customers
        $customersData = [
            ['name' => 'Wayan Putu Wijaya', 'email' => 'wayan.putu@gmail.com', 'phone' => '081999888777', 'address' => 'Jl. Danau Tamblingan No. 12, Sanur, Denpasar'],
            ['name' => 'Kadek Ari Suryani', 'email' => 'kadek.ari@gmail.com', 'phone' => '081888777666', 'address' => 'Jl. Raya Canggu No. 45, Badung, Bali'],
            ['name' => 'Nyoman Gede Rama', 'email' => 'rama.nyoman@yahoo.com', 'phone' => '081777666555', 'address' => 'Jl. Monkey Forest No. 89, Ubud, Gianyar'],
            ['name' => 'Ketut Desi Saraswati', 'email' => 'desi.saraswati@gmail.com', 'phone' => '081666555444', 'address' => 'Jl. Teuku Umar No. 201, Denpasar Barat'],
            ['name' => 'Made Ananda Putra', 'email' => 'ananda.putra@outlook.com', 'phone' => '081555444333', 'address' => 'Jl. By Pass Ngurah Rai No. 300, Jimbaran'],
            ['name' => 'Luh Putu Ratna Dewi', 'email' => 'ratna.dewi@gmail.com', 'phone' => '081444333222', 'address' => 'Jl. Raya Kintamani No. 55, Bangli'],
        ];

        $customers = [];
        foreach ($customersData as $c) {
            $customers[] = Customer::create($c);
        }

        // 5. Seed Projects Across Different Months & Statuses

        // Project 1: COMPLETED (Bulan Lalu)
        $date1 = Carbon::now()->subDays(20)->toDateString();
        $b1 = Booking::create([
            'booking_code' => 'BOOK-ART-001',
            'customer_id' => $customers[0]->id,
            'photo_package_id' => $pkgSigGrad->id,
            'booking_date' => $date1,
            'status' => 'CONFIRMED',
            'notes' => 'Wisuda Universitas Udayana Kampus Sudirman',
            'package_name' => $pkgSigGrad->name,
            'package_price' => $pkgSigGrad->price,
            'package_duration' => $pkgSigGrad->duration_minutes,
            'package_includes_mua' => $pkgSigGrad->includes_mua,
        ]);

        $s1 = Schedule::create([
            'booking_id' => $b1->id,
            'customer_id' => $customers[0]->id,
            'photo_package_id' => $pkgSigGrad->id,
            'date' => $date1,
            'start_time' => '08:30:00',
            'end_time' => '10:00:00',
            'location_name' => 'Gedung Rektorat Unud Sudirman',
            'location_address' => 'Jl. PB Sudirman, Denpasar Barat, Bali',
            'latitude' => -8.67123400,
            'longitude' => 115.21567800,
            'location_radius' => 150,
            'location_notes' => 'Tunggu di depan lapangan Rektorat',
            'status' => 'COMPLETED',
        ]);

        $p1 = Project::create([
            'project_code' => 'PRJ-ART-001',
            'project_name' => 'Graduation Wayan Putu',
            'booking_id' => $b1->id,
            'schedule_id' => $s1->id,
            'customer_id' => $customers[0]->id,
            'photo_package_id' => $pkgSigGrad->id,
            'package_name' => $pkgSigGrad->name,
            'package_price' => $pkgSigGrad->price,
            'package_duration' => $pkgSigGrad->duration_minutes,
            'package_includes_mua' => $pkgSigGrad->includes_mua,
            'date' => $date1,
            'location_name' => $s1->location_name,
            'location_address' => $s1->location_address,
            'latitude' => $s1->latitude,
            'longitude' => $s1->longitude,
            'location_radius' => $s1->location_radius,
            'status' => 'COMPLETED',
            'work_start_time' => '08:30:00',
            'work_end_time' => '10:00:00',
            'work_duration_minutes' => 90,
        ]);
        $p1->photographers()->attach($photographerAgus->id);
        $p1->muas()->attach($muaSari->id);

        PhotographerProjectSalary::create([
            'project_id' => $p1->id,
            'photographer_id' => $photographerAgus->id,
            'amount' => 300000,
            'work_start_time' => '08:30:00',
            'work_end_time' => '10:00:00',
            'work_duration_minutes' => 90,
            'payment_status' => 'PAID',
            'payment_method' => 'TRANSFER',
            'paid_at' => Carbon::now()->subDays(18),
            'payment_note' => 'Transfer via BCA',
            'created_by' => $admin->id,
        ]);

        MuaProjectFee::create([
            'project_id' => $p1->id,
            'mua_id' => $muaSari->id,
            'amount' => 250000,
            'work_start_time' => '07:00:00',
            'work_end_time' => '08:30:00',
            'work_duration_minutes' => 90,
            'payment_status' => 'PAID',
            'payment_method' => 'TRANSFER',
            'paid_at' => Carbon::now()->subDays(18),
            'created_by' => $admin->id,
        ]);

        ProjectExpense::create([
            'project_id' => $p1->id,
            'name' => 'Transportasi & Cetak Foto 10R',
            'amount' => 60000,
            'description' => 'Bensin & cetak frame wisuda',
            'created_by' => $admin->id,
        ]);

        PhotoSessionProof::create([
            'schedule_id' => $s1->id,
            'project_id' => $p1->id,
            'photographer_id' => $photographerAgus->id,
            'type' => 'START',
            'photo_path' => 'proofs/sample_start_01.jpg',
            'latitude' => -8.67124000,
            'longitude' => 115.21568000,
            'accuracy' => 10.0,
            'distance_from_location' => 15.0,
            'captured_at' => Carbon::parse("{$date1} 08:28:00"),
            'status' => 'START_VALID',
            'admin_id' => $admin->id,
            'admin_note' => 'Lokasi sesuai di Unud Sudirman',
            'validated_at' => Carbon::parse("{$date1} 08:35:00"),
        ]);

        PhotoSessionProof::create([
            'schedule_id' => $s1->id,
            'project_id' => $p1->id,
            'photographer_id' => $photographerAgus->id,
            'type' => 'END',
            'photo_path' => 'proofs/sample_end_01.jpg',
            'latitude' => -8.67123500,
            'longitude' => 115.21567500,
            'accuracy' => 8.5,
            'distance_from_location' => 10.0,
            'captured_at' => Carbon::parse("{$date1} 10:02:00"),
            'status' => 'END_VALID',
            'admin_id' => $admin->id,
            'admin_note' => 'Foto bukti selesai tepat waktu',
            'validated_at' => Carbon::parse("{$date1} 10:10:00"),
        ]);

        // Project 2: COMPLETED (Wedding Intimate)
        $date2 = Carbon::now()->subDays(10)->toDateString();
        $b2 = Booking::create([
            'booking_code' => 'BOOK-ART-002',
            'customer_id' => $customers[1]->id,
            'photo_package_id' => $pkgWedBasic->id,
            'booking_date' => $date2,
            'status' => 'CONFIRMED',
            'notes' => 'Pernikahan Intimate di Villa Canggu',
            'package_name' => $pkgWedBasic->name,
            'package_price' => $pkgWedBasic->price,
            'package_duration' => $pkgWedBasic->duration_minutes,
            'package_includes_mua' => $pkgWedBasic->includes_mua,
        ]);

        $s2 = Schedule::create([
            'booking_id' => $b2->id,
            'customer_id' => $customers[1]->id,
            'photo_package_id' => $pkgWedBasic->id,
            'date' => $date2,
            'start_time' => '15:00:00',
            'end_time' => '19:00:00',
            'location_name' => 'The Lawn Canggu Villa',
            'location_address' => 'Jl. Pura Dalem, Canggu, Badung, Bali',
            'latitude' => -8.65432100,
            'longitude' => 115.13245600,
            'location_radius' => 200,
            'location_notes' => 'Sesi foto sunset di area garden villa',
            'status' => 'COMPLETED',
        ]);

        $p2 = Project::create([
            'project_code' => 'PRJ-ART-002',
            'project_name' => 'Wedding Kadek Ari & Partner',
            'booking_id' => $b2->id,
            'schedule_id' => $s2->id,
            'customer_id' => $customers[1]->id,
            'photo_package_id' => $pkgWedBasic->id,
            'package_name' => $pkgWedBasic->name,
            'package_price' => $pkgWedBasic->price,
            'package_duration' => $pkgWedBasic->duration_minutes,
            'package_includes_mua' => $pkgWedBasic->includes_mua,
            'date' => $date2,
            'location_name' => $s2->location_name,
            'location_address' => $s2->location_address,
            'latitude' => $s2->latitude,
            'longitude' => $s2->longitude,
            'location_radius' => $s2->location_radius,
            'status' => 'COMPLETED',
            'work_start_time' => '15:00:00',
            'work_end_time' => '19:00:00',
            'work_duration_minutes' => 240,
        ]);
        $p2->photographers()->attach([$photographerBudi->id, $photographerDika->id]);
        $p2->muas()->attach($muaDewi->id);

        PhotographerProjectSalary::create([
            'project_id' => $p2->id,
            'photographer_id' => $photographerBudi->id,
            'amount' => 700000,
            'payment_status' => 'PAID',
            'payment_method' => 'TRANSFER',
            'paid_at' => Carbon::now()->subDays(8),
            'created_by' => $admin->id,
        ]);

        PhotographerProjectSalary::create([
            'project_id' => $p2->id,
            'photographer_id' => $photographerDika->id,
            'amount' => 500000,
            'payment_status' => 'UNPAID',
            'created_by' => $admin->id,
        ]);

        MuaProjectFee::create([
            'project_id' => $p2->id,
            'mua_id' => $muaDewi->id,
            'amount' => 600000,
            'payment_status' => 'UNPAID',
            'created_by' => $admin->id,
        ]);

        ProjectExpense::create([
            'project_id' => $p2->id,
            'name' => 'Sewa Lighting Assistant & Transport',
            'amount' => 200000,
            'created_by' => $admin->id,
        ]);

        // Project 3: EDITING (Prewedding)
        $date3 = Carbon::now()->subDays(2)->toDateString();
        $b3 = Booking::create([
            'booking_code' => 'BOOK-ART-003',
            'customer_id' => $customers[2]->id,
            'photo_package_id' => $pkgPrewedBasic->id,
            'booking_date' => $date3,
            'status' => 'CONFIRMED',
            'notes' => 'Prewedding Kintamani & Pantai Mengiat',
            'package_name' => $pkgPrewedBasic->name,
            'package_price' => $pkgPrewedBasic->price,
            'package_duration' => $pkgPrewedBasic->duration_minutes,
            'package_includes_mua' => $pkgPrewedBasic->includes_mua,
        ]);

        $s3 = Schedule::create([
            'booking_id' => $b3->id,
            'customer_id' => $customers[2]->id,
            'photo_package_id' => $pkgPrewedBasic->id,
            'date' => $date3,
            'start_time' => '06:00:00',
            'end_time' => '09:00:00',
            'location_name' => 'Pinggan Sunrise Kintamani',
            'location_address' => 'Desa Pinggan, Kintamani, Bangli, Bali',
            'latitude' => -8.23456700,
            'longitude' => 115.34567800,
            'location_radius' => 300,
            'location_notes' => 'Sesi sunrise jam 6 pagi',
            'status' => 'SHOOTING',
        ]);

        $p3 = Project::create([
            'project_code' => 'PRJ-ART-003',
            'project_name' => 'Prewedding Nyoman Rama',
            'booking_id' => $b3->id,
            'schedule_id' => $s3->id,
            'customer_id' => $customers[2]->id,
            'photo_package_id' => $pkgPrewedBasic->id,
            'package_name' => $pkgPrewedBasic->name,
            'package_price' => $pkgPrewedBasic->price,
            'package_duration' => $pkgPrewedBasic->duration_minutes,
            'package_includes_mua' => $pkgPrewedBasic->includes_mua,
            'date' => $date3,
            'location_name' => $s3->location_name,
            'location_address' => $s3->location_address,
            'latitude' => $s3->latitude,
            'longitude' => $s3->longitude,
            'location_radius' => $s3->location_radius,
            'status' => 'EDITING',
            'work_start_time' => '06:00:00',
            'work_end_time' => '09:00:00',
            'work_duration_minutes' => 180,
        ]);
        $p3->photographers()->attach($photographerBudi->id);
        $p3->muas()->attach($muaNia->id);

        PhotographerProjectSalary::create([
            'project_id' => $p3->id,
            'photographer_id' => $photographerBudi->id,
            'amount' => 700000,
            'payment_status' => 'UNPAID',
            'created_by' => $admin->id,
        ]);

        MuaProjectFee::create([
            'project_id' => $p3->id,
            'mua_id' => $muaNia->id,
            'amount' => 400000,
            'payment_status' => 'UNPAID',
            'created_by' => $admin->id,
        ]);

        // Proof for P3 pending validation
        PhotoSessionProof::create([
            'schedule_id' => $s3->id,
            'project_id' => $p3->id,
            'photographer_id' => $photographerBudi->id,
            'type' => 'START',
            'photo_path' => 'proofs/sample_start_03.jpg',
            'latitude' => -8.23458000,
            'longitude' => 115.34569000,
            'accuracy' => 14.0,
            'distance_from_location' => 22.0,
            'captured_at' => Carbon::parse("{$date3} 05:58:00"),
            'status' => 'START_PENDING',
        ]);

        // Project 4: SHOOTING HARI INI
        $today = Carbon::today()->toDateString();
        $b4 = Booking::create([
            'booking_code' => 'BOOK-ART-004',
            'customer_id' => $customers[3]->id,
            'photo_package_id' => $pkgBasicGrad->id,
            'booking_date' => $today,
            'status' => 'CONFIRMED',
            'notes' => 'Wisuda Poltekpar Bali',
            'package_name' => $pkgBasicGrad->name,
            'package_price' => $pkgBasicGrad->price,
            'package_duration' => $pkgBasicGrad->duration_minutes,
            'package_includes_mua' => $pkgBasicGrad->includes_mua,
        ]);

        $s4 = Schedule::create([
            'booking_id' => $b4->id,
            'customer_id' => $customers[3]->id,
            'photo_package_id' => $pkgBasicGrad->id,
            'date' => $today,
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'location_name' => 'Kampus Poltekpar Bali Nusa Dua',
            'location_address' => 'Jl. Raya Nusa Dua Selatan, Badung, Bali',
            'latitude' => -8.80123400,
            'longitude' => 115.22345600,
            'location_radius' => 100,
            'location_notes' => 'Tunggu di lobby utama Poltekpar',
            'status' => 'SHOOTING',
        ]);

        $p4 = Project::create([
            'project_code' => 'PRJ-ART-004',
            'project_name' => 'Wisuda Ketut Desi',
            'booking_id' => $b4->id,
            'schedule_id' => $s4->id,
            'customer_id' => $customers[3]->id,
            'photo_package_id' => $pkgBasicGrad->id,
            'package_name' => $pkgBasicGrad->name,
            'package_price' => $pkgBasicGrad->price,
            'package_duration' => $pkgBasicGrad->duration_minutes,
            'package_includes_mua' => $pkgBasicGrad->includes_mua,
            'date' => $today,
            'location_name' => $s4->location_name,
            'location_address' => $s4->location_address,
            'latitude' => $s4->latitude,
            'longitude' => $s4->longitude,
            'location_radius' => $s4->location_radius,
            'status' => 'SHOOTING',
            'work_start_time' => '10:00:00',
            'work_end_time' => '11:00:00',
            'work_duration_minutes' => 60,
        ]);
        $p4->photographers()->attach($photographerCitra->id);

        PhotographerProjectSalary::create([
            'project_id' => $p4->id,
            'photographer_id' => $photographerCitra->id,
            'amount' => 250000,
            'payment_status' => 'UNPAID',
            'created_by' => $admin->id,
        ]);

        PhotoSessionProof::create([
            'schedule_id' => $s4->id,
            'project_id' => $p4->id,
            'photographer_id' => $photographerCitra->id,
            'type' => 'START',
            'photo_path' => 'proofs/sample_start_04.jpg',
            'latitude' => -8.80124000,
            'longitude' => 115.22346000,
            'accuracy' => 8.0,
            'distance_from_location' => 12.0,
            'captured_at' => Carbon::now()->subMinutes(15),
            'status' => 'START_PENDING',
        ]);

        // Project 5: UPCOMING SCHEDULE (Besok)
        $tomorrow = Carbon::tomorrow()->toDateString();
        $b5 = Booking::create([
            'booking_code' => 'BOOK-ART-005',
            'customer_id' => $customers[4]->id,
            'photo_package_id' => $pkgPortrait->id,
            'booking_date' => $tomorrow,
            'status' => 'CONFIRMED',
            'notes' => 'Photoshoot Personal Branding untuk profil LinkedIn',
            'package_name' => $pkgPortrait->name,
            'package_price' => $pkgPortrait->price,
            'package_duration' => $pkgPortrait->duration_minutes,
            'package_includes_mua' => $pkgPortrait->includes_mua,
        ]);

        $s5 = Schedule::create([
            'booking_id' => $b5->id,
            'customer_id' => $customers[4]->id,
            'photo_package_id' => $pkgPortrait->id,
            'date' => $tomorrow,
            'start_time' => '14:00:00',
            'end_time' => '15:00:00',
            'location_name' => 'Studio ARTDEVATA Denpasar',
            'location_address' => 'Jl. Gatot Subroto Tengah No. 99, Denpasar',
            'latitude' => -8.64123400,
            'longitude' => 115.20567800,
            'location_radius' => 50,
            'location_notes' => 'Studio B Indoor',
            'status' => 'SCHEDULED',
        ]);

        $p5 = Project::create([
            'project_code' => 'PRJ-ART-005',
            'project_name' => 'Portrait Made Ananda',
            'booking_id' => $b5->id,
            'schedule_id' => $s5->id,
            'customer_id' => $customers[4]->id,
            'photo_package_id' => $pkgPortrait->id,
            'package_name' => $pkgPortrait->name,
            'package_price' => $pkgPortrait->price,
            'package_duration' => $pkgPortrait->duration_minutes,
            'package_includes_mua' => $pkgPortrait->includes_mua,
            'date' => $tomorrow,
            'location_name' => $s5->location_name,
            'location_address' => $s5->location_address,
            'latitude' => $s5->latitude,
            'longitude' => $s5->longitude,
            'location_radius' => $s5->location_radius,
            'status' => 'SCHEDULED',
        ]);
        $p5->photographers()->attach($photographerCitra->id);

        PhotographerProjectSalary::create([
            'project_id' => $p5->id,
            'photographer_id' => $photographerCitra->id,
            'amount' => 250000,
            'payment_status' => 'UNPAID',
            'created_by' => $admin->id,
        ]);

        // 6. Activity Logs
        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'SYSTEM_SEED',
            'module' => 'SYSTEM',
            'description' => 'Sistem Fotografi ARTDEVATA di-seed dengan data transaksi lengkap.',
            'ip_address' => '127.0.0.1',
        ]);

        ActivityLog::create([
            'user_id' => $photographerAgus->id,
            'action' => 'PROOF_SUBMIT',
            'module' => 'PHOTO_PROOF',
            'record_id' => $s1->id,
            'description' => 'Agus Photography mengunggah foto bukti START pemotretan.',
            'ip_address' => '180.252.12.34',
        ]);

        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'PROOF_VALIDATE',
            'module' => 'PHOTO_PROOF',
            'record_id' => $s1->id,
            'description' => 'Admin mengonfirmasi validitas bukti pemotretan START.',
            'ip_address' => '127.0.0.1',
        ]);
    }
}
