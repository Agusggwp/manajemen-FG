<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PhotoPackage;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function packageProfit(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $category = $request->input('category');

        $packagesQuery = PhotoPackage::query();
        if ($category) {
            $packagesQuery->where('category', $category);
        }
        $packages = $packagesQuery->get();

        $reportData = $packages->map(function ($pkg) use ($startDate, $endDate) {
            $projectsQuery = Project::with(['photographerSalaries', 'muaFees', 'expenses'])
                ->where('photo_package_id', $pkg->id)
                ->where('status', 'COMPLETED');

            if ($startDate) {
                $projectsQuery->whereDate('date', '>=', $startDate);
            }
            if ($endDate) {
                $projectsQuery->whereDate('date', '<=', $endDate);
            }

            $projects = $projectsQuery->get();

            $projectCount = $projects->count();
            $totalRevenue = (float) $projects->sum('package_price');

            $totalCost = (float) $projects->sum(function ($p) {
                return $p->actual_total_cost;
            });

            $totalProfit = $totalRevenue - $totalCost;
            $avgProfit = $projectCount > 0 ? round($totalProfit / $projectCount, 2) : 0.0;
            $avgMargin = $totalRevenue > 0 ? round(($totalProfit / $totalRevenue) * 100, 2) : 0.0;

            return [
                'package_id' => $pkg->id,
                'package_name' => $pkg->name,
                'category' => $pkg->category,
                'includes_mua' => $pkg->includes_mua,
                'price' => (float) $pkg->price,
                'project_count' => $projectCount,
                'total_revenue' => $totalRevenue,
                'total_cost' => $totalCost,
                'total_profit' => $totalProfit,
                'avg_profit' => $avgProfit,
                'avg_margin' => $avgMargin,
            ];
        });

        $totalAllRevenue = $reportData->sum('total_revenue');
        $totalAllCost = $reportData->sum('total_cost');
        $totalAllProfit = $totalAllRevenue - $totalAllCost;
        $totalAllMargin = $totalAllRevenue > 0 ? round(($totalAllProfit / $totalAllRevenue) * 100, 2) : 0;

        return Inertia::render('Admin/Reports/PackageProfit', [
            'reportData' => $reportData,
            'summary' => [
                'total_revenue' => $totalAllRevenue,
                'total_cost' => $totalAllCost,
                'total_profit' => $totalAllProfit,
                'total_margin' => $totalAllMargin,
                'total_projects' => $reportData->sum('project_count'),
            ],
            'filters' => [
                'start_date' => (string) $request->input('start_date', ''),
                'end_date' => (string) $request->input('end_date', ''),
                'category' => (string) $request->input('category', ''),
            ],
            'categories' => ['Wedding', 'Graduation', 'Portrait', 'Product', 'Event', 'Prewedding', 'Commercial', 'Other'],
        ]);
    }
}
