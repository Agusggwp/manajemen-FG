<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $muaPackages = [
            [
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
                'features' => json_encode([
                    'Makeup Natural Glam Flawless & Tahan Seharian',
                    'Hairdo Elegan atau Hijab Styling Modern',
                    'Free Pemasangan Softlens & Bulu Mata Premium',
                    'Free Setting Spray & Touch Up Kit Mini',
                ]),
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
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
                'features' => json_encode([
                    'High-End Cosmetic Complexion Tahan Seharian & Keringat',
                    'Hair Styling atau Hijab Do Khusus Prewedding',
                    '1x Touch Up / Ganti Warna Lipstik saat Sesi',
                    'Pemasangan Aksesoris Rambut / Headpiece Simpel',
                ]),
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
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
                'features' => json_encode([
                    'Luxury HD Bridal Makeup & Complexion Tahan Seharian',
                    'Sanggul Modern / Hairdo Pengantin / Hijab Styling Mewah',
                    'Pemasangan Melati Segar / Mahkota / Veil Pengantin',
                    'Standby Pendampingan Touch Up Selama Acara Inti',
                ]),
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($muaPackages as $package) {
            $exists = DB::table('photo_packages')
                ->where('name', $package['name'])
                ->whereNull('deleted_at')
                ->exists();

            if (! $exists) {
                DB::table('photo_packages')->insert($package);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('photo_packages')
            ->whereIn('name', [
                'Paket MUA Wisuda / Graduation Glam',
                'Paket MUA Prewedding / Engagement Look',
                'Paket MUA Bridal / Akad Nikah Signature',
            ])
            ->delete();
    }
};
