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
}
