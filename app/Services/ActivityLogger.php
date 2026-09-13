<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
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
    public static function log(string $action, string $module, string $description, ?int $recordId = null): ActivityLog
    {
        $log = ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => strtoupper($action),
            'module' => strtoupper($module),
            'record_id' => $recordId,
            'description' => $description,
            'ip_address' => Request::ip() ?? '127.0.0.1',
        ]);

        // Trigger Discord Webhook Notification asynchronously/safely
        self::sendDiscordNotification($log);

        return $log;
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
                'CREATED' => 65280,      // Emerald Green
                'LOGIN' => 65280,        // Emerald Green
                'VALIDATE' => 65280,     // Emerald Green
                'UPDATED' => 16750592,   // Amber / Yellow
                'SETTINGS' => 16750592,  // Amber / Yellow
                'DEV_TOOL_EXEC' => 10181046, // Purple
                'DELETED' => 15744000,   // Red
                'LOGOUT' => 15744000,    // Red
                'DEV_TOOL_ERROR' => 15744000, // Red
            ];

            $actionUpper = strtoupper($log->action);
            $embedColor = $colorMap[$actionUpper] ?? 3885046; // Default Blue

            $embedPayload = [
                'username' => 'ARTDEVATA System Log',
                'avatar_url' => asset('logo.svg'),
                'embeds' => [
                    [
                        'title' => "📷 [{$log->action}] - {$log->module}",
                        'description' => $log->description,
                        'color' => $embedColor,
                        'fields' => [
                            [
                                'name' => '👤 User',
                                'value' => "{$userName} ({$userRole})",
                                'inline' => true,
                            ],
                            [
                                'name' => '🌐 IP Address',
                                'value' => $log->ip_address ?? '127.0.0.1',
                                'inline' => true,
                            ],
                            [
                                'name' => '📌 Modul',
                                'value' => $log->module,
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

            // Send HTTP POST to Discord Webhook with short timeout
            Http::timeout(3)->post($webhookUrl, $embedPayload);

            return true;
        } catch (\Throwable $e) {
            // Silently swallow errors so system logger never crashes main request
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
