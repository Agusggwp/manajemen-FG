<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Log an activity in the system and send Discord Webhook notification.
     *
     * @param string $action Action name (e.g. 'CREATED', 'UPDATED', 'DELETED')
     * @param string $module Module name (e.g. 'PACKAGE', 'SCHEDULE', 'PROJECT')
     * @param string $description Detailed description
     * @param int|null $recordId
     * @return ActivityLog
     */
    /**
     * Log an activity in the system and send Discord Webhook notification.
     *
     * @param string $action Action name (e.g. 'CREATED', 'UPDATED', 'DELETED')
     * @param string $module Module name (e.g. 'PACKAGE', 'SCHEDULE', 'PROJECT')
     * @param string $description Detailed description
     * @param int|null $recordId
     * @return ActivityLog
     */
    public static function log(string $action, string $module, string $description, ?int $recordId = null): ActivityLog
    {
        $ip = Request::ip() ?? '127.0.0.1';
        $uaString = Request::header('User-Agent');
        $uaInfo = self::parseUserAgent($uaString);

        $clientInfo = "Perangkat: {$uaInfo['device']} ({$uaInfo['platform']}) | Browser: {$uaInfo['browser']} | IP: {$ip}";

        // Automatically append device, browser, and IP info if not already included
        if (!str_contains($description, 'Perangkat:')) {
            $description = trim($description) . ". {$clientInfo}";
        }

        $log = ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => strtoupper($action),
            'module' => strtoupper($module),
            'record_id' => $recordId,
            'description' => $description,
            'ip_address' => $ip,
        ]);

        // Trigger Discord Webhook Notification safely
        self::sendDiscordNotification($log);

        return $log;
    }

    /**
     * Parse User-Agent header string to detect Device, OS/Platform, and Browser.
     *
     * @param string|null $userAgent
     * @return array
     */
    public static function parseUserAgent(?string $userAgent): array
    {
        if (empty($userAgent)) {
            return [
                'device' => 'Unknown Device',
                'platform' => 'Unknown OS',
                'browser' => 'Unknown Browser',
            ];
        }

        // Detect Device Type
        $device = 'Desktop';
        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $userAgent)) {
            $device = 'Tablet';
        } elseif (preg_match('/(Mobile|iPod|iPhone|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|hpwOS|webOS|Fennec|Minimo|Opera Mini|Opera Mobi)/i', $userAgent)) {
            $device = 'Mobile';
        }

        // Detect OS / Platform
        $platform = 'Unknown OS';
        if (preg_match('/windows nt 10/i', $userAgent)) {
            $platform = 'Windows 10/11';
        } elseif (preg_match('/windows nt 6.3/i', $userAgent)) {
            $platform = 'Windows 8.1';
        } elseif (preg_match('/windows nt 6.2/i', $userAgent)) {
            $platform = 'Windows 8';
        } elseif (preg_match('/windows nt 6.1/i', $userAgent)) {
            $platform = 'Windows 7';
        } elseif (preg_match('/iphone/i', $userAgent)) {
            $platform = 'iOS (iPhone)';
        } elseif (preg_match('/ipad/i', $userAgent)) {
            $platform = 'iOS (iPad)';
        } elseif (preg_match('/macintosh|mac os x/i', $userAgent)) {
            $platform = 'macOS';
        } elseif (preg_match('/android/i', $userAgent)) {
            $platform = 'Android';
        } elseif (preg_match('/linux/i', $userAgent)) {
            $platform = 'Linux';
        }

        // Detect Browser
        $browser = 'Unknown Browser';
        if (preg_match('/edg/i', $userAgent)) {
            $browser = 'Microsoft Edge';
        } elseif (preg_match('/chrome/i', $userAgent)) {
            $browser = 'Google Chrome';
        } elseif (preg_match('/safari/i', $userAgent)) {
            $browser = 'Apple Safari';
        } elseif (preg_match('/firefox/i', $userAgent)) {
            $browser = 'Mozilla Firefox';
        } elseif (preg_match('/opera|opr/i', $userAgent)) {
            $browser = 'Opera';
        }

        return [
            'device' => $device,
            'platform' => $platform,
            'browser' => $browser,
        ];
    }

    /**
     * Log web page access with IP, Device, Platform, and Browser details.
     *
     * @param string $module
     * @param string $descriptionPrefix
     * @return ActivityLog
     */
    public static function logAccess(string $module = 'PUBLIC_CATALOG', string $descriptionPrefix = 'Pengunjung mengakses katalog publik'): ActivityLog
    {
        $ip = Request::ip() ?? '127.0.0.1';
        $uaString = Request::header('User-Agent');
        $uaInfo = self::parseUserAgent($uaString);

        $description = "{$descriptionPrefix}. Perangkat: {$uaInfo['device']} ({$uaInfo['platform']}) | Browser: {$uaInfo['browser']} | IP: {$ip}";

        return self::log('VIEW', $module, $description);
    }


    /**
     * Send log notification to Discord Webhook.
     */
    public static function sendDiscordNotification(ActivityLog $log): bool
    {
        try {
            $webhookUrl = self::getDiscordWebhookUrl();
            $enabled = self::isDiscordNotifyEnabled();

            if (!$enabled || empty($webhookUrl)) {
                return false;
            }

            $user = $log->user;
            $userName = $user ? $user->name : 'Sistem / Anonim';
            $userRole = $user ? $user->role : 'SYSTEM';

            $colorMap = [
                'CREATED' => 65280,          // Emerald Green
                'LOGIN' => 65280,            // Emerald Green
                'VALIDATE' => 65280,         // Emerald Green
                'VALIDATED' => 65280,        // Emerald Green
                'LOCATION_ALLOWED' => 65280, // Emerald Green
                'COOKIE_ACCEPTED' => 65280,  // Emerald Green
                'PAID' => 65280,             // Emerald Green
                'RESET_PASSWORD_SUCCESS' => 65280,
                'UPDATED' => 16750592,       // Amber / Yellow
                'SETTINGS' => 16750592,      // Amber / Yellow
                'DEV_TOOL_EXEC' => 10181046, // Purple
                'DELETED' => 15744000,       // Red
                'LOGOUT' => 15744000,        // Red
                'DEV_TOOL_ERROR' => 15744000,// Red
                'LOCATION_DENIED' => 15744000, // Red
                'COOKIE_REJECTED' => 15744000, // Red
                'FORGOT_PASSWORD_REQUEST' => 3885046,
                'VIEW' => 3447003,           // Ocean Blue
                'PUBLIC_CATALOG' => 3447003, // Ocean Blue
            ];

            $actionUpper = strtoupper($log->action);
            $embedColor = $colorMap[$actionUpper] ?? 3885046; // Default Blue

            $embedPayload = [
                'username' => 'ARTDEVATA System Log',
                'embeds' => [
                    [
                        'title' => "📷 [{$log->action}] - {$log->module}",
                        'description' => (string) ($log->description ?: 'Aktivitas dicatat.'),
                        'color' => $embedColor,
                        'fields' => [
                            [
                                'name' => '👤 User',
                                'value' => "{$userName} ({$userRole})",
                                'inline' => true,
                            ],
                            [
                                'name' => '🌐 IP Address',
                                'value' => (string) ($log->ip_address ?: '127.0.0.1'),
                                'inline' => true,
                            ],
                            [
                                'name' => '📌 Modul',
                                'value' => (string) ($log->module ?: 'GENERAL'),
                                'inline' => true,
                            ],
                        ],
                        'footer' => [
                            'text' => 'ARTDEVATA Photography System',
                        ],
                        'timestamp' => now()->toISOString(),
                    ],
                ],
            ];

            // Only add avatar_url if it is a public https URL
            $assetUrl = asset('logo.svg');
            if (str_starts_with($assetUrl, 'https://')) {
                $embedPayload['avatar_url'] = $assetUrl;
            }

            // Send HTTP POST to Discord Webhook with 5s timeout
            $response = Http::timeout(5)->post($webhookUrl, $embedPayload);

            if (!$response->successful()) {
                Log::warning('Discord Webhook failed with status: ' . $response->status() . ' Body: ' . $response->body());
                return false;
            }

            return true;
        } catch (\Throwable $e) {
            Log::error('Discord Webhook Exception: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Helper to resolve active Discord Webhook URL.
     */
    public static function getDiscordWebhookUrl(): ?string
    {
        try {
            $dbSetting = SystemSetting::where('key', 'discord_webhook_url')->value('value');
            if (!empty($dbSetting)) {
                return $dbSetting;
            }
        } catch (\Throwable $e) {
            // Database lookup fallback
        }

        return config('services.discord.webhook_url') ?: env('DISCORD_WEBHOOK_URL');
    }

    /**
     * Helper to check if Discord notification is enabled.
     */
    public static function isDiscordNotifyEnabled(): bool
    {
        try {
            $setting = SystemSetting::where('key', 'discord_notify_enabled')->value('value');
            if ($setting !== null) {
                return $setting === 'true' || $setting === '1';
            }
        } catch (\Throwable $e) {
            // Database lookup fallback
        }

        return true;
    }
}
