<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Mua;
use App\Models\MuaProjectFee;
use App\Models\PhotoPackage;
use App\Models\PhotographerProjectSalary;
use App\Models\PhotoSessionProof;
use App\Models\Project;
use App\Models\ProjectExpense;
use App\Models\Schedule;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->toDateString();

        $todaysScheduleCount = Schedule::whereDate('date', $today)->count();
        $ongoingProjectsCount = Project::whereIn('status', ['SHOOTING', 'EDITING', 'REVIEW'])->count();
        $waitingValidationCount = PhotoSessionProof::whereIn('status', ['START_PENDING', 'END_PENDING'])->count();
        $completedProjectsCount = Project::where('status', 'COMPLETED')->count();

        $totalCustomers = Customer::count();
        $totalPhotographers = User::photographer()->count();
        $totalMuas = Mua::count();

        // Financial calculations from database
        $completedProjects = Project::with(['photographerSalaries', 'muaFees', 'expenses'])
            ->where('status', 'COMPLETED')
            ->get();

        $totalRevenue = (float) $completedProjects->sum('package_price');

        $totalPhotographerCost = (float) PhotographerProjectSalary::whereHas('project', function ($q) {
            $q->where('status', 'COMPLETED');
        })->sum('amount');

        $totalMuaCost = (float) MuaProjectFee::whereHas('project', function ($q) {
            $q->where('status', 'COMPLETED');
        })->sum('amount');

        $totalExpenses = (float) ProjectExpense::whereHas('project', function ($q) {
            $q->where('status', 'COMPLETED');
        })->sum('amount');

        $totalCost = $totalPhotographerCost + $totalMuaCost + $totalExpenses;
        $totalProfit = $totalRevenue - $totalCost;
        $margin = $totalRevenue > 0 ? round(($totalProfit / $totalRevenue) * 100, 2) : 0;

        $unpaidPhotographerSalaries = (float) PhotographerProjectSalary::where('payment_status', 'UNPAID')->sum('amount');
        $unpaidMuaFees = (float) MuaProjectFee::where('payment_status', 'UNPAID')->sum('amount');

        // Recent Schedules & Proofs
        $recentSchedules = Schedule::with(['customer', 'photoPackage'])
            ->orderBy('date', 'desc')
            ->orderBy('start_time', 'asc')
            ->limit(5)
            ->get();

        $pendingProofs = PhotoSessionProof::with(['photographer', 'schedule.customer', 'project'])
            ->whereIn('status', ['START_PENDING', 'END_PENDING'])
            ->orderBy('captured_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'todaysScheduleCount' => $todaysScheduleCount,
                'ongoingProjectsCount' => $ongoingProjectsCount,
                'waitingValidationCount' => $waitingValidationCount,
                'completedProjectsCount' => $completedProjectsCount,
                'totalCustomers' => $totalCustomers,
                'totalPhotographers' => $totalPhotographers,
                'totalMuas' => $totalMuas,
                'totalRevenue' => $totalRevenue,
                'totalCost' => $totalCost,
                'totalProfit' => $totalProfit,
                'margin' => $margin,
                'unpaidPhotographerSalaries' => $unpaidPhotographerSalaries,
                'unpaidMuaFees' => $unpaidMuaFees,
            ],
            'recentSchedules' => $recentSchedules,
            'pendingProofs' => $pendingProofs,
        ]);
    }
}
