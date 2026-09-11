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
use App\Models\Schedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Admin
        $admin = User::create([
            'name' => 'Admin ARTDEVATA',
            'email' => 'admin@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'phone' => '081234567890',
            'status' => 'ACTIVE',
        ]);

        // 2. Create Photographers
        $photographerAgus = User::create([
            'name' => 'Agus Photographer',
            'email' => 'agus@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'PHOTOGRAPHER',
            'phone' => '081298765432',
            'specialty' => 'Graduation & Event',
            'bio' => 'Senior Photographer ARTDEVATA Bali',
            'status' => 'ACTIVE',
        ]);

        $photographerBudi = User::create([
            'name' => 'Budi Photographer',
            'email' => 'budi@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'PHOTOGRAPHER',
            'phone' => '081345678901',
            'specialty' => 'Wedding & Prewedding',
            'bio' => 'Wedding Specialist ARTDEVATA',
            'status' => 'ACTIVE',
        ]);

        $photographerCitra = User::create([
            'name' => 'Citra Photographer',
            'email' => 'citra@artdevata.com',
            'password' => Hash::make('password'),
            'role' => 'PHOTOGRAPHER',
            'phone' => '081456789012',
            'specialty' => 'Portrait & Product',
            'status' => 'ACTIVE',
        ]);

        // 3. Create MUAs
        $muaSari = Mua::create([
            'name' => 'Sari MUA Bali',
            'email' => 'sari@artdevata.com',
            'phone' => '087890123456',
            'address' => 'Denpasar, Bali',
            'specialty' => 'Graduation & Glamour Makeup',
            'status' => 'ACTIVE',
        ]);

        $muaDewi = Mua::create([
            'name' => 'Dewi Bridal MUA',
            'email' => 'dewi@artdevata.com',
            'phone' => '087812345678',
            'address' => 'Badung, Bali',
            'specialty' => 'Traditional & International Bridal',
            'status' => 'ACTIVE',
        ]);

        // 4. Create Master Photo Packages
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
            'description' => 'Paket wisuda ekonomis dengan 1 photographer.',
            'features' => ['1 Photographer', 'Durasi 60 Menit', '25 Edited Photos', 'All Raw Photos'],
            'status' => 'ACTIVE',
        ]);

        $pkgSigGrad = PhotoPackage::create([
            'name' => 'Signature Graduation',
            'category' => 'Graduation',
            'price' => 850000,
            'duration_minutes' => 90,
            'number_of_photos' => 40,
            'number_of_photographers' => 1,
            'includes_mua' => true,
            'estimated_photographer_cost' => 300000,
            'estimated_mua_fee' => 200000,
            'estimated_operational_cost' => 50000,
            'description' => 'Paket wisuda lengkap termasuk Make Up Artist professional.',
            'features' => ['1 Photographer', 'Termasuk MUA', 'Durasi 90 Menit', '40 Edited Photos'],
            'status' => 'ACTIVE',
        ]);

        $pkgWedBasic = PhotoPackage::create([
            'name' => 'Wedding Basic',
            'category' => 'Wedding',
            'price' => 3500000,
            'duration_minutes' => 240,
            'number_of_photos' => 150,
            'number_of_photographers' => 2,
            'includes_mua' => true,
            'estimated_photographer_cost' => 1000000,
            'estimated_mua_fee' => 500000,
            'estimated_operational_cost' => 200000,
            'description' => 'Dokumentasi pernikahan intimate dengan 2 photographer.',
            'features' => ['2 Photographers', 'Termasuk MUA', 'Durasi 4 Jam', 'Album Cetak 20R'],
            'status' => 'ACTIVE',
        ]);

        $pkgPrewedBasic = PhotoPackage::create([
            'name' => 'Prewedding Basic',
            'category' => 'Prewedding',
            'price' => 2200000,
            'duration_minutes' => 180,
            'number_of_photos' => 80,
            'number_of_photographers' => 1,
            'includes_mua' => true,
            'estimated_photographer_cost' => 600000,
            'estimated_mua_fee' => 350000,
            'estimated_operational_cost' => 150000,
            'description' => 'Foto prewedding indoor / outdoor Bali.',
            'features' => ['1 Photographer', 'Termasuk MUA', '2 Lokasi Pemotretan', '80 High-Res Photos'],
            'status' => 'ACTIVE',
        ]);

        // 5. Create Customers
        $customerWayan = Customer::create([
            'name' => 'Wayan Putu',
            'email' => 'wayan@gmail.com',
            'phone' => '081999888777',
            'address' => 'Jl. Danau Tamblingan No. 12, Sanur, Denpasar',
        ]);

        $customerKadek = Customer::create([
            'name' => 'Kadek Ari',
            'email' => 'kadek@gmail.com',
            'phone' => '081888777666',
            'address' => 'Jl. Raya Canggu No. 45, Badung',
        ]);

        // 6. Create Bookings, Schedules & Projects
        $booking1 = Booking::create([
            'booking_code' => 'BOOK-'.strtoupper(substr(md5(time().'1'), 0, 6)),
            'customer_id' => $customerWayan->id,
            'photo_package_id' => $pkgSigGrad->id,
            'booking_date' => Carbon::now()->toDateString(),
            'status' => 'CONFIRMED',
            'notes' => 'Wisuda Universitas Udayana',
            'package_name' => $pkgSigGrad->name,
            'package_price' => $pkgSigGrad->price,
            'package_duration' => $pkgSigGrad->duration_minutes,
            'package_includes_mua' => $pkgSigGrad->includes_mua,
        ]);

        $schedule1 = Schedule::create([
            'booking_id' => $booking1->id,
            'customer_id' => $customerWayan->id,
            'photo_package_id' => $pkgSigGrad->id,
            'date' => Carbon::now()->toDateString(),
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'location_name' => 'Kampus Sudirman Unud',
            'location_address' => 'Jl. PB Sudirman, Denpasar Barat, Bali',
            'latitude' => -8.67123400,
            'longitude' => 115.21567800,
            'location_radius' => 150,
            'location_notes' => 'Tunggu di depan gedung rektorat',
            'status' => 'SHOOTING',
        ]);

        $project1 = Project::create([
            'project_code' => 'PRJ-'.strtoupper(substr(md5(time().'11'), 0, 6)),
            'project_name' => 'Graduation Wayan Putu',
            'booking_id' => $booking1->id,
            'schedule_id' => $schedule1->id,
            'customer_id' => $customerWayan->id,
            'photo_package_id' => $pkgSigGrad->id,
            'package_name' => $pkgSigGrad->name,
            'package_price' => $pkgSigGrad->price,
            'package_duration' => $pkgSigGrad->duration_minutes,
            'package_includes_mua' => $pkgSigGrad->includes_mua,
            'date' => Carbon::now()->toDateString(),
            'location_name' => $schedule1->location_name,
            'location_address' => $schedule1->location_address,
            'latitude' => $schedule1->latitude,
            'longitude' => $schedule1->longitude,
            'location_radius' => $schedule1->location_radius,
            'status' => 'SHOOTING',
            'work_start_time' => '09:00:00',
            'work_end_time' => '11:00:00',
            'work_duration_minutes' => 120,
        ]);

        // Attach Photographer & MUA
        $project1->photographers()->attach($photographerAgus->id);
        $project1->muas()->attach($muaSari->id);

        // Project Salary & MUA Fee
        PhotographerProjectSalary::create([
            'project_id' => $project1->id,
            'photographer_id' => $photographerAgus->id,
            'amount' => 300000,
            'work_start_time' => '09:00:00',
            'work_end_time' => '11:00:00',
            'work_duration_minutes' => 120,
            'payment_status' => 'UNPAID',
            'created_by' => $admin->id,
        ]);

        MuaProjectFee::create([
            'project_id' => $project1->id,
            'mua_id' => $muaSari->id,
            'amount' => 200000,
            'work_start_time' => '07:30:00',
            'work_end_time' => '09:00:00',
            'work_duration_minutes' => 90,
            'payment_status' => 'UNPAID',
            'created_by' => $admin->id,
        ]);

        ProjectExpense::create([
            'project_id' => $project1->id,
            'name' => 'Transport & Parkir Kampus',
            'amount' => 35000,
            'description' => 'Biaya parkir area gedung rektorat & bensin',
            'created_by' => $admin->id,
        ]);

        // Photo Session Proof (START submitted by Agus)
        PhotoSessionProof::create([
            'schedule_id' => $schedule1->id,
            'project_id' => $project1->id,
            'photographer_id' => $photographerAgus->id,
            'type' => 'START',
            'photo_path' => 'proofs/sample_start_proof.jpg',
            'latitude' => -8.67125000,
            'longitude' => 115.21570000,
            'accuracy' => 12.5,
            'distance_from_location' => 42.5,
            'captured_at' => Carbon::now()->subMinutes(60),
            'status' => 'START_VALID',
            'admin_id' => $admin->id,
            'admin_note' => 'Lokasi tepat di gedung rektorat Unud.',
            'validated_at' => Carbon::now()->subMinutes(50),
        ]);

        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'CREATED',
            'module' => 'SYSTEM',
            'description' => 'Sistem Fotografi ARTDEVATA berhasil di-seed.',
            'ip_address' => '127.0.0.1',
        ]);
    }
}
