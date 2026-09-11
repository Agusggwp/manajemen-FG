<?php

namespace App\Http\Controllers\Photographer;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $photographerId = auth()->id();

        $query = Schedule::with(['customer', 'photoPackage', 'project'])
            ->whereHas('project.photographers', function ($q) use ($photographerId) {
                $q->where('users.id', $photographerId);
            });

        if ($date = $request->input('date')) {
            $query->whereDate('date', $date);
        }

        $schedules = $query->orderBy('date', 'asc')->orderBy('start_time', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('Photographer/Schedules/Index', [
            'schedules' => $schedules,
            'filters' => [
                'date' => (string) $request->input('date', ''),
            ],
        ]);
    }

    public function show(Schedule $schedule)
    {
        $photographerId = auth()->id();

        // Server-side authorization verification
        $isAssigned = $schedule->project && $schedule->project->photographers->contains($photographerId);
        if (! $isAssigned) {
            abort(403, 'Anda tidak memiliki akses ke jadwal ini.');
        }

        $schedule->load(['customer', 'photoPackage', 'project.photographers', 'project.muas', 'proofs' => function ($q) use ($photographerId) {
            $q->where('photographer_id', $photographerId);
        }]);

        return Inertia::render('Photographer/Schedules/Show', [
            'schedule' => $schedule,
        ]);
    }
}
