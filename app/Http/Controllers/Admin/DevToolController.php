<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mua;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DevToolController extends Controller
{
    /**
     * Show Dev Tools dashboard with system info & migration status.
     */
    public function index()
    {
        $systemInfo = $this->getSystemInfo();

        return inertia('Admin/DevTools/Index', [
            'systemInfo' => $systemInfo,
        ]);
    }

    /**
     * Execute a whitelisted dev tool command.
     */
    public function execute(Request $request)
    {
        $request->validate([
            'action' => 'required|string',
            'confirm_text' => 'nullable|string',
        ]);

        $action = $request->input('action');
        $confirmText = $request->input('confirm_text');

        $allowedActions = [
            'migrate' => 'Menjalankan Migrasi Database (php artisan migrate)',
            'migrate_rollback' => 'Rollback Migrasi Terakhir (php artisan migrate:rollback)',
            'migrate_status' => 'Mengecek Status Migrasi (php artisan migrate:status)',
            'db_seed' => 'Menjalankan Seeder (php artisan db:seed)',
            'migrate_fresh' => 'Fresh Migration (php artisan migrate:fresh)',
            'optimize_clear' => 'Clear Cache System & Route (php artisan optimize:clear)',
            'cache_clear' => 'Clear Application Cache (php artisan cache:clear)',
            'route_clear' => 'Clear Route Cache (php artisan route:clear)',
            'view_clear' => 'Clear Compiled Views (php artisan view:clear)',
            'storage_link' => 'Buat Symlink Storage (php artisan storage:link)',
            'composer_install' => 'Instal Dependensi PHP (composer install)',
            'composer_dump' => 'Dump Autoload Composer (composer dump-autoload)',
            'npm_install' => 'Instal Dependensi JS (npm install)',
            'npm_build' => 'Build Asset Production (npm run build)',
        ];

        if (!array_key_exists($action, $allowedActions)) {
            return response()->json([
                'success' => false,
                'message' => 'Perintah tidak diizinkan atau tidak valid.',
                'output' => 'ERROR: Perintah ' . $action . ' tidak dikenali.',
            ], 422);
        }

        // Special confirmation check for destructive commands
        if ($action === 'migrate_fresh' && strtoupper((string)$confirmText) !== 'RESET') {
            return response()->json([
                'success' => false,
                'message' => 'Konfirmasi Reset tidak sesuai. Ketik RESET untuk melanjutkan.',
                'output' => 'ERROR: Konfirmasi dibatalkan oleh pengguna.',
            ], 422);
        }

        $output = '';

        try {
            switch ($action) {
                case 'migrate':
                    Artisan::call('migrate', ['--force' => true]);
                    $output = Artisan::output();
                    break;

                case 'migrate_rollback':
                    Artisan::call('migrate:rollback', ['--force' => true]);
                    $output = Artisan::output();
                    break;

                case 'migrate_status':
                    Artisan::call('migrate:status');
                    $output = Artisan::output();
                    break;

                case 'db_seed':
                    Artisan::call('db:seed', ['--force' => true]);
                    $output = Artisan::output();
                    break;

                case 'migrate_fresh':
                    Artisan::call('migrate:fresh', ['--force' => true]);
                    $output = Artisan::output();
                    break;

                case 'optimize_clear':
                    Artisan::call('optimize:clear');
                    $output = Artisan::output();
                    break;

                case 'cache_clear':
                    Artisan::call('cache:clear');
                    $output = Artisan::output();
                    break;

                case 'route_clear':
                    Artisan::call('route:clear');
                    $output = Artisan::output();
                    break;

                case 'view_clear':
                    Artisan::call('view:clear');
                    $output = Artisan::output();
                    break;

                case 'storage_link':
                    Artisan::call('storage:link');
                    $output = Artisan::output();
                    break;

                case 'composer_install':
                    $output = $this->runShellCommand('composer install --no-interaction --prefer-dist 2>&1');
                    break;

                case 'composer_dump':
                    $output = $this->runShellCommand('composer dump-autoload --no-interaction 2>&1');
                    break;

                case 'npm_install':
                    $output = $this->runShellCommand('npm install 2>&1');
                    break;

                case 'npm_build':
                    $output = $this->runShellCommand('npm run build 2>&1');
                    break;
            }

            if (empty(trim((string)$output))) {
                $output = "Perintah berhasil dieksekusi tanpa output tambahan.";
            }

            ActivityLogger::log(
                'DEV_TOOL_EXEC',
                'DEV_TOOL',
                "Berhasil menjalankan perintah: {$allowedActions[$action]}"
            );

            return response()->json([
                'success' => true,
                'message' => "Perintah '{$allowedActions[$action]}' berhasil dijalankan.",
                'output' => $output,
                'systemInfo' => $this->getSystemInfo(),
            ]);

        } catch (\Throwable $e) {
            $output = "EXCEPTION EXECUTING COMMAND:\n" . $e->getMessage() . "\n" . $e->getTraceAsString();

            ActivityLogger::log(
                'DEV_TOOL_ERROR',
                'DEV_TOOL',
                "Gagal menjalankan perintah: {$allowedActions[$action]} - Error: " . $e->getMessage()
            );

            return response()->json([
                'success' => false,
                'message' => "Gagal mengeksekusi perintah: " . $e->getMessage(),
                'output' => $output,
                'systemInfo' => $this->getSystemInfo(),
            ], 500);
        }
    }

    /**
     * Helper to run shell command safely in project root directory.
     */
    private function runShellCommand(string $command): string
    {
        $basePath = base_path();

        if (function_exists('exec')) {
            $outputArray = [];
            $returnVar = 0;
            $fullCommand = "cd " . escapeshellarg($basePath) . " && " . $command;
            @exec($fullCommand, $outputArray, $returnVar);
            return implode("\n", $outputArray);
        } elseif (function_exists('shell_exec')) {
            $fullCommand = "cd " . escapeshellarg($basePath) . " && " . $command;
            return (string) @shell_exec($fullCommand);
        }

        return "Fungsi exec() atau shell_exec() dinonaktifkan di server PHP ini.";
    }

    /**
     * Gather system diagnostic information.
     */
    private function getSystemInfo(): array
    {
        $dbConnected = false;
        $dbName = '-';
        $dbDriver = config('database.default', 'mysql');
        $migrationCount = 0;

        try {
            $dbName = DB::connection()->getDatabaseName();
            $dbConnected = true;

            if (Schema::hasTable('migrations')) {
                $migrationCount = DB::table('migrations')->count();
            }
        } catch (\Throwable $e) {
            $dbConnected = false;
        }

        $migrationFilesCount = count(glob(database_path('migrations/*.php')));

        return [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'os' => PHP_OS_FAMILY . ' (' . php_uname('s') . ' ' . php_uname('r') . ')',
            'db_connected' => $dbConnected,
            'db_name' => $dbName,
            'db_driver' => $dbDriver,
            'executed_migrations' => $migrationCount,
            'total_migration_files' => $migrationFilesCount,
            'pending_migrations' => max(0, $migrationFilesCount - $migrationCount),
            'storage_symlink_exists' => file_exists(public_path('storage')),
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => ini_get('max_execution_time') . 's',
            'admin_count' => User::where('role', 'ADMIN')->count(),
            'photographer_count' => User::where('role', 'PHOTOGRAPHER')->count(),
            'mua_count' => User::where('role', 'MUA')->count(),
            'master_mua_count' => \App\Models\Mua::count(),
            'environment' => app()->environment(),
            'debug_mode' => config('app.debug') ? 'Aktif (TRUE)' : 'Non-aktif (FALSE)',
            'server_time' => now()->format('Y-m-d H:i:s T'),
        ];
    }
}
