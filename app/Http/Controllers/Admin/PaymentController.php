<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MuaProjectFee;
use App\Models\PhotographerProjectSalary;
use App\Services\ActivityLogger;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function photographerSalaries(Request $request)
    {
        $query = PhotographerProjectSalary::with(['photographer', 'project.customer']);

        if ($status = $request->input('status')) {
            $query->where('payment_status', $status);
        }

        if ($search = $request->input('search')) {
            $query->whereHas('photographer', fn ($p) => $p->where('name', 'like', "%{$search}%"))
                ->orWhereHas('project', fn ($prj) => $prj->where('project_name', 'like', "%{$search}%"));
        }

        $salaries = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $unpaidTotal = (float) PhotographerProjectSalary::where('payment_status', 'UNPAID')->sum('amount');
        $paidTotal = (float) PhotographerProjectSalary::where('payment_status', 'PAID')->sum('amount');

        return Inertia::render('Admin/Payments/Salaries', [
            'salaries' => $salaries,
            'filters' => $request->only(['status', 'search']),
            'unpaidTotal' => $unpaidTotal,
            'paidTotal' => $paidTotal,
        ]);
    }

    public function markSalaryPaid(Request $request, PhotographerProjectSalary $salary)
    {
        $validated = $request->validate([
            'payment_method' => 'required|string',
            'payment_note' => 'nullable|string',
        ]);

        $salary->update([
            'payment_status' => 'PAID',
            'paid_at' => Carbon::now(),
            'payment_method' => $validated['payment_method'],
            'payment_note' => $validated['payment_note'] ?? null,
        ]);

        ActivityLogger::log('PAID', 'SALARY', "Gaji Photographer {$salary->photographer->name} (Rp " . number_format($salary->amount, 0, ',', '.') . ") ditandai SUDAH DIBAYAR.", $salary->id);

        return back()->with('success', "Gaji photographer {$salary->photographer->name} berhasil ditandai LUNAS.");
    }

    public function muaFees(Request $request)
    {
        $query = MuaProjectFee::with(['mua', 'project.customer']);

        if ($status = $request->input('status')) {
            $query->where('payment_status', $status);
        }

        if ($search = $request->input('search')) {
            $query->whereHas('mua', fn ($m) => $m->where('name', 'like', "%{$search}%"))
                ->orWhereHas('project', fn ($prj) => $prj->where('project_name', 'like', "%{$search}%"));
        }

        $fees = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $unpaidTotal = (float) MuaProjectFee::where('payment_status', 'UNPAID')->sum('amount');
        $paidTotal = (float) MuaProjectFee::where('payment_status', 'PAID')->sum('amount');

        return Inertia::render('Admin/Payments/MuaFees', [
            'fees' => $fees,
            'filters' => $request->only(['status', 'search']),
            'unpaidTotal' => $unpaidTotal,
            'paidTotal' => $paidTotal,
        ]);
    }

    public function markMuaFeePaid(Request $request, MuaProjectFee $fee)
    {
        $validated = $request->validate([
            'payment_method' => 'required|string',
            'payment_note' => 'nullable|string',
        ]);

        $fee->update([
            'payment_status' => 'PAID',
            'paid_at' => Carbon::now(),
            'payment_method' => $validated['payment_method'],
            'payment_note' => $validated['payment_note'] ?? null,
        ]);

        ActivityLogger::log('PAID', 'MUA_FEE', "Fee MUA {$fee->mua->name} (Rp " . number_format($fee->amount, 0, ',', '.') . ") ditandai SUDAH DIBAYAR.", $fee->id);

        return back()->with('success', "Fee MUA {$fee->mua->name} berhasil ditandai LUNAS.");
    }
}
