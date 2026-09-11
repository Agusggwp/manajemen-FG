<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Log an activity in the system.
     *
     * @param string $action Action name (e.g. 'CREATED', 'UPDATED', 'DELETED')
     * @param string $module Module name (e.g. 'PACKAGE', 'SCHEDULE', 'PROJECT')
     * @param string $description Detailed description
     * @param int|null $recordId
     * @return ActivityLog
     */
    public static function log(string $action, string $module, string $description, ?int $recordId = null): ActivityLog
    {
        return ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => strtoupper($action),
            'module' => strtoupper($module),
            'record_id' => $recordId,
            'description' => $description,
            'ip_address' => Request::ip(),
        ]);
    }
}
