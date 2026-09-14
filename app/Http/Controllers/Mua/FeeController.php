<?php

namespace App\Http\Controllers\Mua;

use App\Http\Controllers\Controller;
use App\Models\Mua;
use App\Models\MuaProjectFee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeeController extends Controller
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

        $query = MuaProjectFee::with(['project.customer', 'project.photoPackage'])
            ->where('mua_id', $muaId);

        if ($search = $request->input('search')) {
            $query->whereHas('project', function ($pq) use ($search) {
                $pq->where('project_code', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            if ($status !== 'ALL') {
                $query->where('payment_status', $status);
            }
        }

        $summary = [
            'totalFee' => (float) MuaProjectFee::where('mua_id', $muaId)->sum('amount'),
            'paidFee' => (float) MuaProjectFee::where('mua_id', $muaId)->where('payment_status', 'PAID')->sum('amount'),
            'unpaidFee' => (float) MuaProjectFee::where('mua_id', $muaId)->where('payment_status', 'UNPAID')->sum('amount'),
        ];

        $fees = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Mua/Fees/Index', [
            'fees' => $fees,
            'summary' => $summary,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'status' => (string) $request->input('status', 'ALL'),
            ],
        ]);
    }
}
