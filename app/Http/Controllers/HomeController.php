<?php

namespace App\Http\Controllers;

use App\Models\PhotoPackage;
use App\Models\Portfolio;
use App\Models\SystemSetting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // Log access with IP, Browser, and Device information
        ActivityLogger::logAccess('PUBLIC_CATALOG', 'Pengunjung mengakses katalog paket publik');
        $categories = PhotoPackage::active()
            ->pluck('category')
            ->unique()
            ->values();

        $packages = PhotoPackage::active()
            ->with('mua')
            ->orderBy('price', 'asc')
            ->get();

        $portfolios = Portfolio::active()->ordered()->get();

        $settings = SystemSetting::all()->pluck('value', 'key');

        return Inertia::render('Public/Packages', [
            'packages' => $packages,
            'categories' => $categories,
            'portfolios' => $portfolios,
            'settings' => $settings,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * Log public cookie & location consent to database and Discord.
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

            $locDetails[] = "Titik GPS: {$lat}, {$lng} (Akurasi: ±{$accuracy}m)";
            if ($speed !== null && $speed > 0) {
                $locDetails[] = "Kecepatan: {$speed} m/s";
            }
            $locDetails[] = "Google Maps: {$mapUrl}";

            $description = "Pengunjung mengizinkan cookie & GPS akurat. " . implode(' | ', $locDetails);
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

        $log = ActivityLogger::log($action, 'PUBLIC_CATALOG', $description);

        if ($request->header('X-Inertia')) {
            return back();
        }

        return response()->json([
            'success' => true,
            'message' => 'Consent logged successfully.',
            'log_id' => $log->id,
        ]);
    }
}
