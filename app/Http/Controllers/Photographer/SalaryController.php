<?php

namespace App\Http\Controllers\Photographer;

use App\Http\Controllers\Controller;
use App\Models\PhotographerProjectSalary;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalaryController extends Controller
{
    public function index(Request $request)
    {
        $photographerId = auth()->id();

        $query = PhotographerProjectSalary::with(['project.customer', 'project.photoPackage'])
            ->where('photographer_id', $photographerId);

        if ($status = $request->input('status')) {
            $query->where('payment_status', $status);
        }

        $salaries = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $unpaidTotal = (float) PhotographerProjectSalary::where('photographer_id', $photographerId)
            ->where('payment_status', 'UNPAID')
            ->sum('amount');

        $paidTotal = (float) PhotographerProjectSalary::where('photographer_id', $photographerId)
            ->where('payment_status', 'PAID')
            ->sum('amount');

        return Inertia::render('Photographer/Salary/Index', [
            'salaries' => $salaries,
            'unpaidTotal' => $unpaidTotal,
            'paidTotal' => $paidTotal,
            'filters' => $request->only(['status']),
        ]);
    }
}
