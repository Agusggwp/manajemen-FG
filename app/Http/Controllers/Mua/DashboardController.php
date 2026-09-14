<?php

namespace App\Http\Controllers\Mua;

use App\Http\Controllers\Controller;
use App\Models\Mua;
use App\Models\MuaProjectFee;
use App\Models\Project;
use App\Models\Schedule;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $mua = $user->mua ?? Mua::where('user_id', $user->id)->orWhere('email', $user->email)->first();
        $muaId = $mua?->id ?? 0;
        $today = Carbon::today()->toDateString();

        // 1. Schedule Counts
        $todaysScheduleCount = Schedule::whereHas('project.muas', function ($q) use ($muaId) {
            $q->where('muas.id', $muaId);
        })->whereDate('date', $today)->count();

        $upcomingSchedulesCount = Schedule::whereHas('project.muas', function ($q) use ($muaId) {
            $q->where('muas.id', $muaId);
        })->whereDate('date', '>=', $today)->count();

        // 2. Project Counts
        $myProjectsCount = Project::whereHas('muas', function ($q) use ($muaId) {
            $q->where('muas.id', $muaId);
        })->count();

        $ongoingCount = Project::whereHas('muas', function ($q) use ($muaId) {
            $q->where('muas.id', $muaId);
        })->whereIn('status', ['PLANNING', 'SCHEDULED', 'SHOOTING'])->count();

        $completedCount = Project::whereHas('muas', function ($q) use ($muaId) {
            $q->where('muas.id', $muaId);
        })->whereIn('status', ['COMPLETED', 'DELIVERED'])->count();

        // 3. Financial Breakdown (Fees)
        $currentMonthStart = Carbon::now()->startOfMonth();
        $currentMonthEnd = Carbon::now()->endOfMonth();

        $monthlyEarnings = (float) MuaProjectFee::where('mua_id', $muaId)
            ->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
            ->sum('amount');

        $unpaidFees = (float) MuaProjectFee::where('mua_id', $muaId)
            ->where('payment_status', 'UNPAID')
            ->sum('amount');

        $paidFees = (float) MuaProjectFee::where('mua_id', $muaId)
            ->where('payment_status', 'PAID')
            ->sum('amount');

        // 4. Monthly Earnings Trend (Last 6 Months)
        $earningsTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();
            $monthLabel = $monthStart->translatedFormat('M Y');

            $mPaid = (float) MuaProjectFee::where('mua_id', $muaId)
                ->where('payment_status', 'PAID')
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->sum('amount');

            $mUnpaid = (float) MuaProjectFee::where('mua_id', $muaId)
                ->where('payment_status', 'UNPAID')
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->sum('amount');

            $earningsTrend[] = [
                'month' => $monthLabel,
                'paid' => $mPaid,
                'unpaid' => $mUnpaid,
                'total' => $mPaid + $mUnpaid,
            ];
        }

        // 5. Project Status Breakdown
        $projectStatusBreakdown = Project::whereHas('muas', function ($q) use ($muaId) {
            $q->where('muas.id', $muaId);
        })
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // 6. Recent / Upcoming Schedules
        $myRecentSchedules = Schedule::with(['customer', 'photoPackage', 'project.photographers'])
            ->whereHas('project.muas', function ($q) use ($muaId) {
                $q->where('muas.id', $muaId);
            })
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        // 7. Recent Fees
        $recentFees = MuaProjectFee::with(['project'])
            ->where('mua_id', $muaId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Mua/Dashboard', [
            'mua' => $mua,
            'stats' => [
                'todaysScheduleCount' => $todaysScheduleCount,
                'upcomingSchedulesCount' => $upcomingSchedulesCount,
                'myProjectsCount' => $myProjectsCount,
                'ongoingCount' => $ongoingCount,
                'completedCount' => $completedCount,
                'monthlyEarnings' => $monthlyEarnings,
                'unpaidFees' => $unpaidFees,
                'paidFees' => $paidFees,
            ],
            'earningsTrend' => $earningsTrend,
            'statusBreakdown' => $projectStatusBreakdown,
            'recentSchedules' => $myRecentSchedules,
            'recentFees' => $recentFees,
        ]);
    }
}
