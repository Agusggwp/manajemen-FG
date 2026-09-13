<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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
            'reminder_email_time' => 'nullable|string',
            // Portal & App Theme Settings
            'app_theme' => 'nullable|in:light,dark,system',
            // Public Web Settings
            'public_theme_mode' => 'nullable|in:light,dark',
            'public_hero_badge' => 'nullable|string',
            'public_hero_title' => 'nullable|string',
            'public_hero_subtitle' => 'nullable|string',
            'public_whatsapp_number' => 'nullable|string',
            'public_cta_title' => 'nullable|string',
            'public_show_search' => 'nullable|string',
            'public_show_categories' => 'nullable|string',
            // Discord Webhook Settings
            'discord_webhook_url' => 'nullable|url',
            'discord_notify_enabled' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => (string) ($value ?? '')]
            );
        }

        ActivityLogger::log('UPDATED', 'SETTINGS', 'Pengaturan sistem, tampilan web, & Discord Webhook diperbarui.');

        return back()->with('success', 'Pengaturan sistem & integrasi Discord berhasil disimpan.');
    }

    /**
     * Send a test notification message to Discord Webhook.
     */
    public function testDiscord(Request $request)
    {
        $request->validate([
            'webhook_url' => 'required|url',
        ], [
            'webhook_url.required' => 'URL Webhook Discord wajib diisi.',
            'webhook_url.url' => 'Format URL Webhook Discord tidak valid.',
        ]);

        $webhookUrl = $request->input('webhook_url');

        try {
            $embedPayload = [
                'username' => 'ARTDEVATA System Tester',
                'embeds' => [
                    [
                        'title' => '🔔 Uji Coba Koneksi Discord Webhook ARTDEVATA',
                        'description' => 'Selamat! Integrasi Webhook Discord untuk pencatatan log sistem ARTDEVATA Photography telah terhubung dan berfungsi dengan baik.',
                        'color' => 65280, // Emerald Green
                        'fields' => [
                            [
                                'name' => 'Status',
                                'value' => '✅ Terhubung (Connected)',
                                'inline' => true,
                            ],
                            [
                                'name' => 'Penguji',
                                'value' => auth()->user()->name . ' (' . auth()->user()->role . ')',
                                'inline' => true,
                            ],
                        ],
                        'footer' => [
                            'text' => 'ARTDEVATA Photography Management System',
                        ],
                        'timestamp' => now()->toISOString(),
                    ],
                ],
            ];

            $response = Http::timeout(5)->post($webhookUrl, $embedPayload);

            if ($response->successful()) {
                ActivityLogger::log('TEST_DISCORD', 'SETTINGS', 'Mengirimkan pesan pengujian ke Discord Webhook.');
                return back()->with('success', 'Pesan uji coba berhasil terkirim ke channel Discord!');
            }

            return back()->with('error', 'Gagal mengirim ke Discord. Kode Status HTTP: ' . $response->status());

        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal menghubungi Discord Webhook: ' . $e->getMessage());
        }
    }
}
