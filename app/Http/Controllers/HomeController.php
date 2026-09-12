<?php

namespace App\Http\Controllers;

use App\Models\PhotoPackage;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $categories = PhotoPackage::active()
            ->pluck('category')
            ->unique()
            ->values();

        $packages = PhotoPackage::active()
            ->with('mua')
            ->orderBy('price', 'asc')
            ->get();

        $settings = SystemSetting::all()->pluck('value', 'key');

        return Inertia::render('Public/Packages', [
            'packages' => $packages,
            'categories' => $categories,
            'settings' => $settings,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
