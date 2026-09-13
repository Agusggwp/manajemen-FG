<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->string('category')->default('PERNIKAHAN');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed initial default portfolio items
        DB::table('portfolios')->insert([
            [
                'category' => 'PERNIKAHAN',
                'title' => 'Dokumentasi Pernikahan',
                'image' => '/images/pawiwahan.jpeg',
                'description' => 'Momen sakral pernikahan adat & modern yang diabadikan secara alami, sinematik, dan berkesan.',
                'sort_order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'UPACARA YADNYA',
                'title' => 'Upacara Adat & Sakral Bali',
                'image' => '/images/metatah.jpg',
                'description' => 'Dokumentasi yadnya dan upacara kebudayaan Bali dengan sudut pandang eksklusif.',
                'sort_order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'GRADUATION',
                'title' => 'Wisuda & Personal Portrait',
                'image' => '/images/graduation.jpg',
                'description' => 'Selebrasi momen kelulusan wisuda & potret diri dengan pengarahan gaya profesional.',
                'sort_order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'PREWEDDING',
                'title' => 'Prewedding Casual & Adat Bali',
                'image' => '/images/prewedding.jpg',
                'description' => 'Sesi foto prewedding outdoor di lokasi eksotis dengan konsep estetik berkelas.',
                'sort_order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'ACARA PERUSAHAAN',
                'title' => 'Acara Perusahaan Kebersamaan',
                'image' => '/images/makan.jpeg',
                'description' => 'Kegiatan perusahaan untuk membangun semangat kebersamaan, komunikasi, dan kolaborasi yang lebih baik.',
                'sort_order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
