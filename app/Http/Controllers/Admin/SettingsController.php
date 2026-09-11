<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::all()->pluck('value', 'key');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'nullable|string',
            'company_phone' => 'nullable|string',
            'company_address' => 'nullable|string',
            'default_location_radius' => 'nullable|integer|min:10',
        ]);

        foreach ($validated as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => (string) $value]
            );
        }

        ActivityLogger::log('UPDATED', 'SETTINGS', 'Pengaturan sistem ARTDEVATA diperbarui.');

        return back()->with('success', 'Pengaturan sistem berhasil disimpan.');
    }
}
