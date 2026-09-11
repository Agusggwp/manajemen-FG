<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('module', 'like', "%{$search}%");
            });
        }

        if ($module = $request->input('module')) {
            $query->where('module', $module);
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'module']),
        ]);
    }
}
