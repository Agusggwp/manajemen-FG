<?php

namespace App\Http\Controllers\Mua;

use App\Http\Controllers\Controller;
use App\Models\Mua;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    private function getMuaId()
    {
        $user = auth()->user();
        $mua = $user->mua ?? Mua::where('user_id', $user->id)->orWhere('email', $user->email)->first();
        return $mua?->id ?? 0;
    }

    public function index(Request $request)
    {
        $muaId = $this->getMuaId();

        $query = Schedule::with(['customer', 'photoPackage', 'project.photographers'])
            ->whereHas('project.muas', function ($q) use ($muaId) {
                $q->where('muas.id', $muaId);
            });

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('location_name', 'like', "%{$search}%")
                    ->orWhere('location_address', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    })
                    ->orWhereHas('photoPackage', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('date', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('date', '<=', $dateTo);
        }

        $schedules = $query->orderBy('date', 'desc')->orderBy('start_time', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('Mua/Schedules/Index', [
            'schedules' => $schedules,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'status' => (string) $request->input('status', ''),
                'date_from' => (string) $request->input('date_from', ''),
                'date_to' => (string) $request->input('date_to', ''),
            ],
        ]);
    }

    public function show(Schedule $schedule)
    {
        $muaId = $this->getMuaId();

        // Ensure schedule belongs to this MUA
        $hasAccess = $schedule->project()->whereHas('muas', function ($q) use ($muaId) {
            $q->where('muas.id', $muaId);
        })->exists();

        if (! $hasAccess && auth()->user()->role !== 'ADMIN') {
            abort(403, 'Anda tidak memiliki akses ke jadwal ini.');
        }

        $schedule->load(['customer', 'photoPackage', 'project.photographers', 'booking']);

        return Inertia::render('Mua/Schedules/Show', [
            'schedule' => $schedule,
        ]);
    }
}
