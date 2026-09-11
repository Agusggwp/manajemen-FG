<?php

namespace App\Http\Controllers\Photographer;

use App\Http\Controllers\Controller;
use App\Models\PhotographerProjectSalary;
use App\Models\PhotoSessionProof;
use App\Models\Project;
use App\Models\Schedule;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $photographerId = auth()->id();
        $today = Carbon::today()->toDateString();

        $todaysScheduleCount = Schedule::whereHas('project.photographers', function ($q) use ($photographerId) {
            $q->where('users.id', $photographerId);
        })->whereDate('date', $today)->count();

        $myProjectsCount = Project::whereHas('photographers', function ($q) use ($photographerId) {
            $q->where('users.id', $photographerId);
        })->count();

        $ongoingCount = Project::whereHas('photographers', function ($q) use ($photographerId) {
            $q->where('users.id', $photographerId);
        })->whereIn('status', ['SHOOTING', 'EDITING', 'REVIEW'])->count();

        $completedCount = Project::whereHas('photographers', function ($q) use ($photographerId) {
            $q->where('users.id', $photographerId);
        })->where('status', 'COMPLETED')->count();

        // Monthly Earnings
        $currentMonthStart = Carbon::now()->startOfMonth();
        $currentMonthEnd = Carbon::now()->endOfMonth();

        $monthlyEarnings = (float) PhotographerProjectSalary::where('photographer_id', $photographerId)
            ->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
            ->sum('amount');

        $unpaidSalary = (float) PhotographerProjectSalary::where('photographer_id', $photographerId)
            ->where('payment_status', 'UNPAID')
            ->sum('amount');

        $paidSalary = (float) PhotographerProjectSalary::where('photographer_id', $photographerId)
            ->where('payment_status', 'PAID')
            ->sum('amount');

        $myRecentSchedules = Schedule::with(['customer', 'photoPackage'])
            ->whereHas('project.photographers', function ($q) use ($photographerId) {
                $q->where('users.id', $photographerId);
            })
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        $myProofs = PhotoSessionProof::with(['project', 'schedule'])
            ->where('photographer_id', $photographerId)
            ->orderBy('captured_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Photographer/Dashboard', [
            'stats' => [
                'todaysScheduleCount' => $todaysScheduleCount,
                'myProjectsCount' => $myProjectsCount,
                'ongoingCount' => $ongoingCount,
                'completedCount' => $completedCount,
                'monthlyEarnings' => $monthlyEarnings,
                'unpaidSalary' => $unpaidSalary,
                'paidSalary' => $paidSalary,
            ],
            'recentSchedules' => $myRecentSchedules,
            'recentProofs' => $myProofs,
        ]);
    }
}
