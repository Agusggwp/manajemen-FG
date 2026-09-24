<?php

namespace Tests\Feature;

use App\Models\PhotoPackage;
use App\Models\Portfolio;
use App\Models\SystemSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    private function createPackage(array $attributes = []): PhotoPackage
    {
        return PhotoPackage::create(array_merge([
            'name' => 'Graduation Package',
            'category' => 'Graduation',
            'price' => 500000,
            'duration_minutes' => 60,
            'number_of_photos' => 20,
            'number_of_photographers' => 1,
            'includes_mua' => false,
            'estimated_photographer_cost' => 200000,
            'estimated_mua_fee' => 0,
            'estimated_operational_cost' => 20000,
            'status' => 'ACTIVE',
        ], $attributes));
    }

    public function test_can_list_active_packages_via_api(): void
    {
        $this->createPackage([
            'name' => 'Graduation Gold',
            'category' => 'Graduation',
            'price' => 500000,
            'number_of_photographers' => 1,
        ]);

        $this->createPackage([
            'name' => 'MUA Glam Wisuda',
            'category' => 'MUA Only',
            'price' => 350000,
            'number_of_photographers' => 0,
            'includes_mua' => true,
        ]);

        $response = $this->getJson('/api/packages');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'category',
                        'package_type',
                        'price',
                        'formatted_price',
                        'duration_minutes',
                        'number_of_photos',
                        'number_of_photographers',
                        'includes_mua',
                        'description',
                        'features',
                        'mua',
                    ],
                ],
                'meta' => ['total', 'photo_count', 'mua_count', 'filter_count'],
            ]);
    }

    public function test_can_filter_packages_by_type(): void
    {
        $initialPhotoCount = PhotoPackage::active()->where('category', '!=', 'MUA Only')->where('number_of_photographers', '>', 0)->count();
        $initialMuaCount = PhotoPackage::active()->where(function ($q) {
            $q->where('category', 'MUA Only')->orWhere('number_of_photographers', 0);
        })->count();

        $this->createPackage([
            'name' => 'Paket Foto Baru',
            'category' => 'Wedding',
            'price' => 1000000,
            'number_of_photographers' => 1,
        ]);

        $this->createPackage([
            'name' => 'Paket MUA Baru',
            'category' => 'MUA Only',
            'price' => 400000,
            'number_of_photographers' => 0,
            'includes_mua' => true,
        ]);

        $photoResponse = $this->getJson('/api/packages?type=photo');
        $photoResponse->assertStatus(200);
        $this->assertEquals($initialPhotoCount + 1, count($photoResponse->json('data')));

        $muaResponse = $this->getJson('/api/packages?type=mua');
        $muaResponse->assertStatus(200);
        $this->assertEquals($initialMuaCount + 1, count($muaResponse->json('data')));
    }

    public function test_can_get_package_detail(): void
    {
        $pkg = $this->createPackage([
            'name' => 'Special Portrait',
        ]);

        $response = $this->getJson("/api/packages/{$pkg->id}");
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $pkg->id,
                    'name' => 'Special Portrait',
                ],
            ]);
    }

    public function test_can_get_categories_and_portfolios_and_settings(): void
    {
        $this->createPackage([
            'category' => 'Prewedding',
        ]);

        Portfolio::create([
            'title' => 'Sample Bali Wedding',
            'category' => 'Wedding',
            'image' => 'sample.jpg',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        SystemSetting::create([
            'key' => 'company_name',
            'value' => 'Artdevata Photography',
        ]);

        $catRes = $this->getJson('/api/categories');
        $catRes->assertStatus(200)->assertJson(['success' => true]);

        $portRes = $this->getJson('/api/portfolios');
        $portRes->assertStatus(200)->assertJson(['success' => true]);

        $setRes = $this->getJson('/api/settings');
        $setRes->assertStatus(200)->assertJson([
            'success' => true,
            'data' => [
                'company_name' => 'Artdevata Photography',
            ],
        ]);
    }

    public function test_can_submit_inquiry_via_api(): void
    {
        $pkg = $this->createPackage();

        $payload = [
            'name' => 'Kadek Ayu',
            'phone' => '081234567890',
            'email' => 'kadek@example.com',
            'package_id' => $pkg->id,
            'booking_date' => '2026-10-15',
            'location' => 'Sanur Beach',
            'notes' => 'Mau sunrise session',
        ];

        $response = $this->postJson('/api/inquiries', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'customer_name' => 'Kadek Ayu',
                    'status' => 'PENDING',
                ],
            ]);

        $this->assertDatabaseHas('customers', [
            'name' => 'Kadek Ayu',
            'phone' => '081234567890',
        ]);

        $this->assertDatabaseHas('bookings', [
            'photo_package_id' => $pkg->id,
            'status' => 'PENDING',
        ]);
    }
}
