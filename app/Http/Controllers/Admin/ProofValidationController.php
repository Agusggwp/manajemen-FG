<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PhotoSessionProof;
use App\Services\ActivityLogger;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProofValidationController extends Controller
{
    public function index(Request $request)
    {
        $tab = $request->input('tab', 'pending'); // pending, approved, rejected

        $query = PhotoSessionProof::with(['photographer', 'schedule.customer', 'project']);

        if ($tab === 'approved') {
            $query->whereIn('status', ['START_VALID', 'END_VALID']);
        } elseif ($tab === 'rejected') {
            $query->whereIn('status', ['START_REJECTED', 'END_REJECTED']);
        } else {
            $query->whereIn('status', ['START_PENDING', 'END_PENDING']);
        }

        $proofs = $query->orderBy('captured_at', 'desc')->paginate(12)->withQueryString();

        $counts = [
            'pending' => PhotoSessionProof::whereIn('status', ['START_PENDING', 'END_PENDING'])->count(),
            'approved' => PhotoSessionProof::whereIn('status', ['START_VALID', 'END_VALID'])->count(),
            'rejected' => PhotoSessionProof::whereIn('status', ['START_REJECTED', 'END_REJECTED'])->count(),
        ];

        return Inertia::render('Admin/Proofs/Index', [
            'proofs' => $proofs,
            'counts' => $counts,
            'activeTab' => $tab,
        ]);
    }

    public function validateProof(Request $request, PhotoSessionProof $proof)
    {
        $validated = $request->validate([
            'is_valid' => 'required|boolean',
            'admin_note' => 'required_if:is_valid,false|nullable|string',
        ]);

        $isValid = $validated['is_valid'];
        $adminId = auth()->id();

        if ($proof->type === 'START') {
            $newStatus = $isValid ? 'START_VALID' : 'START_REJECTED';
        } else {
            $newStatus = $isValid ? 'END_VALID' : 'END_REJECTED';
        }

        $proof->update([
            'status' => $newStatus,
            'admin_id' => $adminId,
            'admin_note' => $validated['admin_note'] ?? null,
            'validated_at' => Carbon::now(),
        ]);

        // Trigger project state transitions upon valid proof
        if ($isValid && $proof->project) {
            if ($proof->type === 'START') {
                $proof->project->update(['status' => 'SHOOTING']);
                if ($proof->schedule) {
                    $proof->schedule->update(['status' => 'SHOOTING']);
                }
            } elseif ($proof->type === 'END') {
                $proof->project->update(['status' => 'COMPLETED']);
                if ($proof->schedule) {
                    $proof->schedule->update(['status' => 'COMPLETED']);
                }
            }
        }

        $statusText = $isValid ? 'DISETUJUI' : 'DITOLAK';
        ActivityLogger::log('VALIDATED', 'PROOF', "Bukti foto {$proof->type} (ID: {$proof->id}) oleh {$proof->photographer->name} {$statusText} oleh Admin.", $proof->id);

        return back()->with('success', "Bukti foto pemotretan berhasil diproses ({$statusText}).");
    }
}
