<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\PhotoPackage;
use App\Models\Portfolio;
use App\Models\SystemSetting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PublicApiController extends Controller
{
    /**
     * Get active photo & MUA packages with filtering options.
     */
    public function getPackages(Request $request)
    {
        $type = $request->input('type', 'all'); // 'all' | 'photo' | 'mua'
        $category = $request->input('category');
        $search = $request->input('search');
        $sort = $request->input('sort', 'created_at');

        $baseQuery = PhotoPackage::active();

        $totalAll = (clone $baseQuery)->count();
        $totalPhoto = (clone $baseQuery)->where('category', '!=', 'MUA Only')->where('number_of_photographers', '>', 0)->count();
        $totalMua = (clone $baseQuery)->where(function ($q) {
            $q->where('category', 'MUA Only')->orWhere('number_of_photographers', 0);
        })->count();

        $query = PhotoPackage::active()->with(['mua:id,name,specialty,bio,profile_photo,default_fee']);

        // Type filter
        if ($type === 'photo') {
            $query->where('category', '!=', 'MUA Only')->where('number_of_photographers', '>', 0);
        } elseif ($type === 'mua') {
            $query->where(function ($q) {
                $q->where('category', 'MUA Only')->orWhere('number_of_photographers', 0);
            });
        }

        // Category filter
        if (!empty($category) && $category !== 'ALL' && $category !== 'all') {
            $query->where('category', $category);
        }

        // Search query
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'created_at':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $packages = $query->get()->map(function ($pkg) {
            $isMuaOnly = $pkg->category === 'MUA Only' || (int) $pkg->number_of_photographers === 0;

            return [
                'id' => $pkg->id,
                'name' => $pkg->name,
                'category' => $pkg->category,
                'package_type' => $isMuaOnly ? 'MUA_ONLY' : 'PHOTO',
                'price' => (float) $pkg->price,
                'formatted_price' => 'Rp ' . number_format($pkg->price, 0, ',', '.'),
                'duration_minutes' => (int) $pkg->duration_minutes,
                'number_of_photos' => (int) $pkg->number_of_photos,
                'number_of_photographers' => (int) $pkg->number_of_photographers,
                'includes_mua' => (bool) $pkg->includes_mua,
                'description' => $pkg->description,
                'features' => is_array($pkg->features) ? $pkg->features : (is_string($pkg->features) ? json_decode($pkg->features, true) ?? [] : []),
                'mua' => $pkg->mua ? [
                    'id' => $pkg->mua->id,
                    'name' => $pkg->mua->name,
                    'specialty' => $pkg->mua->specialty,
                    'bio' => $pkg->mua->bio,
                    'profile_photo' => $pkg->mua->profile_photo ? asset('storage/' . $pkg->mua->profile_photo) : null,
                    'default_fee' => (float) $pkg->mua->default_fee,
                ] : null,
                'created_at' => $pkg->created_at?->toIso8601String(),
                'updated_at' => $pkg->updated_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $packages,
            'meta' => [
                'total' => $totalAll,
                'photo_count' => $totalPhoto,
                'mua_count' => $totalMua,
                'filter_count' => $packages->count(),
            ],
        ]);
    }

    /**
     * Get detail of a specific package by ID.
     */
    public function getPackageDetail($id)
    {
        $pkg = PhotoPackage::active()->with(['mua:id,name,specialty,bio,profile_photo,default_fee'])->find($id);

        if (!$pkg) {
            return response()->json([
                'success' => false,
                'message' => 'Paket tidak ditemukan atau sedang tidak aktif.',
            ], 404);
        }

        $isMuaOnly = $pkg->category === 'MUA Only' || (int) $pkg->number_of_photographers === 0;

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $pkg->id,
                'name' => $pkg->name,
                'category' => $pkg->category,
                'package_type' => $isMuaOnly ? 'MUA_ONLY' : 'PHOTO',
                'price' => (float) $pkg->price,
                'formatted_price' => 'Rp ' . number_format($pkg->price, 0, ',', '.'),
                'duration_minutes' => (int) $pkg->duration_minutes,
                'number_of_photos' => (int) $pkg->number_of_photos,
                'number_of_photographers' => (int) $pkg->number_of_photographers,
                'includes_mua' => (bool) $pkg->includes_mua,
                'description' => $pkg->description,
                'features' => is_array($pkg->features) ? $pkg->features : (is_string($pkg->features) ? json_decode($pkg->features, true) ?? [] : []),
                'mua' => $pkg->mua ? [
                    'id' => $pkg->mua->id,
                    'name' => $pkg->mua->name,
                    'specialty' => $pkg->mua->specialty,
                    'bio' => $pkg->mua->bio,
                    'profile_photo' => $pkg->mua->profile_photo ? asset('storage/' . $pkg->mua->profile_photo) : null,
                    'default_fee' => (float) $pkg->mua->default_fee,
                ] : null,
                'created_at' => $pkg->created_at?->toIso8601String(),
                'updated_at' => $pkg->updated_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Get active package categories.
     */
    public function getCategories()
    {
        $categories = PhotoPackage::active()
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->orderBy('category', 'asc')
            ->get()
            ->map(function ($row) {
                return [
                    'name' => $row->category,
                    'count' => (int) $row->count,
                    'is_mua' => $row->category === 'MUA Only',
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Get active portfolio gallery items.
     */
    public function getPortfolios(Request $request)
    {
        $category = $request->input('category');

        $query = Portfolio::active()->ordered();

        if (!empty($category) && $category !== 'ALL' && $category !== 'all') {
            $query->where('category', $category);
        }

        $portfolios = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'category' => $item->category,
                'description' => $item->description,
                'image_url' => $item->image_url,
                'sort_order' => (int) $item->sort_order,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $portfolios,
        ]);
    }

    /**
     * Get public site settings & configuration.
     */
    public function getSettings()
    {
        $settings = SystemSetting::all()->pluck('value', 'key');

        $faqs = [
            [
                'question' => 'Bagaimana cara melakukan booking jadwal pemotretan?',
                'answer' => 'Anda dapat memilih paket yang diinginkan lalu mengklik tombol WhatsApp atau mengajukan formulir inquiry online. Tim kami akan mengonfirmasi ketersediaan jadwal, lokasi, dan detail konsep foto.',
            ],
            [
                'question' => 'Apakah lokasi pemotretan bebas dipilih oleh klien?',
                'answer' => 'Ya, Anda dapat merekomendasikan lokasi outdoor atau studio favorit di Bali. Fotografer kami juga dapat memberikan saran lokasi terbaik sesuai dengan konsep paket foto yang Anda pilih.',
            ],
            [
                'question' => 'Berapa lama estimasi penyerahan hasil akhir foto?',
                'answer' => 'Penyerahan softcopy foto mentah/preview dapat diakses dalam 24-48 jam. Hasil foto yang telah melalui retouch & editing final akan dikirimkan dalam kurun waktu 5 - 7 hari kerja.',
            ],
            [
                'question' => 'Apakah paket yang termasuk MUA sudah termasuk busana/kostum?',
                'answer' => 'Paket foto mencakup riasan & hair styling profesional dari MUA mitra kami. Untuk kostum/busana adat/wisuda dapat dikonsultasikan terlebih dahulu atau membawa busana pribadi.',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'company_name' => $settings->get('company_name', 'Artdevata Photography Bali'),
                'whatsapp_number' => $settings->get('public_whatsapp_number', $settings->get('company_phone', '6281999888777')),
                'phone' => $settings->get('company_phone', '081999888777'),
                'email' => $settings->get('company_email', 'contact@artdevata.com'),
                'address' => $settings->get('company_address', 'Denpasar, Bali, Indonesia'),
                'hero_badge' => $settings->get('public_hero_badge', 'Dokumentasi Fotografi & MUA Profesional di Bali'),
                'hero_title' => $settings->get('public_hero_title', 'Abadikan Setiap Momen Istimewa Anda'),
                'hero_subtitle' => $settings->get('public_hero_subtitle', 'Pilihan paket foto terbaik untuk Wisuda, Pernikahan, Prewedding, dan Layanan MUA Profesional di Bali.'),
                'cta_title' => $settings->get('public_cta_title', 'Butuh Penawaran Custom atau Diskusi Lokasi?'),
                'theme_mode' => $settings->get('public_theme_mode', 'light'),
                'show_search' => $settings->get('public_show_search', 'true') !== 'false',
                'show_categories' => $settings->get('public_show_categories', 'true') !== 'false',
                'faqs' => $faqs,
            ],
        ]);
    }

    /**
     * Submit an inquiry / booking request from the external website.
     */
    public function createInquiry(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'package_id' => 'nullable|exists:photo_packages,id',
            'booking_date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Find or create customer
        $customer = Customer::firstOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => $validated['name'],
                'email' => $validated['email'] ?? null,
                'address' => $validated['location'] ?? null,
            ]
        );

        $package = null;
        if (!empty($validated['package_id'])) {
            $package = PhotoPackage::find($validated['package_id']);
        }

        $bookingCode = 'INQ-' . strtoupper(Str::random(6));

        $booking = Booking::create([
            'booking_code' => $bookingCode,
            'customer_id' => $customer->id,
            'photo_package_id' => $package?->id,
            'booking_date' => $validated['booking_date'] ?? now()->addDays(3)->toDateString(),
            'status' => 'PENDING',
            'notes' => $validated['notes'] ?? 'Inquiry dari web publik.',
            'package_name' => $package?->name ?? 'Custom Inquiry',
            'package_price' => $package?->price ?? 0,
            'package_duration' => $package?->duration_minutes ?? 60,
            'package_includes_mua' => $package?->includes_mua ?? false,
        ]);

        ActivityLogger::log(
            'INQUIRY_CREATED',
            'BOOKING',
            "Inquiry baru via API dari {$customer->name} ({$customer->phone}) untuk paket: " . ($package?->name ?? 'Custom'),
            $booking->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Permintaan inquiry pemesanan berhasil dikirim. Tim kami akan segera menghubungi Anda!',
            'data' => [
                'booking_code' => $bookingCode,
                'customer_name' => $customer->name,
                'package_name' => $package?->name ?? null,
                'status' => 'PENDING',
            ],
        ], 201);
    }

    /**
     * Log visitor consent & accurate geolocation from external website.
     */
    public function logConsent(Request $request)
    {
        $status = $request->input('status', 'LOCATION_ALLOWED');
        $lat = $request->input('latitude');
        $lng = $request->input('longitude');
        $accuracy = $request->input('accuracy');
        $address = $request->input('address');
        $city = $request->input('city');
        $district = $request->input('district');
        $province = $request->input('province');
        $postcode = $request->input('postcode');
        $speed = $request->input('speed');
        $error = $request->input('error');

        if ($status === 'LOCATION_ALLOWED' && $lat && $lng) {
            $mapUrl = "https://www.google.com/maps?q={$lat},{$lng}";
            $locDetails = [];
            if (!empty($address)) {
                $locDetails[] = "Alamat: {$address}";
            } elseif (!empty($city)) {
                $locDetails[] = "Wilayah: {$city}";
            }

            $precisionType = $request->input('precision_type');
            if ($precisionType) {
                $locDetails[] = "Metode: {$precisionType}";
            }
            $locDetails[] = "Titik GPS: {$lat}, {$lng} (Akurasi: ±{$accuracy}m)";
            if ($speed !== null && $speed > 0) {
                $locDetails[] = "Kecepatan: {$speed} m/s";
            }
            $locDetails[] = "Google Maps: {$mapUrl}";

            $description = "Pengunjung web publik mengizinkan cookie & lokasi akurat. " . implode(' | ', $locDetails);
            $action = 'LOCATION_ALLOWED';
        } elseif ($status === 'LOCATION_DENIED') {
            $errDetail = $error ? " ({$error})" : "";
            $description = "Pengunjung menyetujui cookie namun menolak akses lokasi GPS browser{$errDetail}.";
            $action = 'LOCATION_DENIED';
        } elseif ($status === 'COOKIE_ACCEPTED') {
            $description = "Pengunjung menyetujui cookie situs ARTDEVATA.";
            $action = 'COOKIE_ACCEPTED';
        } else {
            $description = "Pengunjung menolak izin cookie & lokasi.";
            $action = 'COOKIE_REJECTED';
        }

        $log = ActivityLogger::log($action, 'PUBLIC_API', $description);

        return response()->json([
            'success' => true,
            'message' => 'Consent logged successfully via API.',
            'log_id' => $log->id,
        ]);
    }
}
