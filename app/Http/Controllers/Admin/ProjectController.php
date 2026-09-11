<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mua;
use App\Models\Project;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with(['customer', 'photoPackage', 'photographers', 'muas', 'photographerSalaries', 'muaFees', 'expenses']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('project_code', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($c) => $c->where('name', 'like', "%{$search}%"));
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $projects = $query->orderBy('date', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'status' => (string) $request->input('status', ''),
            ],
            'statuses' => ['PLANNING', 'SCHEDULED', 'SHOOTING', 'EDITING', 'REVIEW', 'COMPLETED', 'DELIVERED', 'CANCELLED'],
            'photographers' => User::photographer()->active()->get(['id', 'name', 'specialty']),
            'muas' => Mua::active()->get(['id', 'name', 'specialty']),
        ]);
    }

    public function show(Project $project)
    {
        $project->load([
            'customer',
            'photoPackage',
            'schedule',
            'photographers',
            'muas',
            'photographerSalaries.photographer',
            'muaFees.mua',
            'expenses.createdBy',
            'proofs.photographer',
            'galleries.photographer',
        ]);

        return Inertia::render('Admin/Projects/Show', [
            'project' => $project,
            'allPhotographers' => User::photographer()->active()->get(['id', 'name']),
            'allMuas' => Mua::active()->get(['id', 'name']),
        ]);
    }

    public function updateStatus(Request $request, Project $project)
    {
        $validated = $request->validate([
            'status' => 'required|in:PLANNING,SCHEDULED,SHOOTING,EDITING,REVIEW,COMPLETED,DELIVERED,CANCELLED',
        ]);

        $project->update(['status' => $validated['status']]);

        if ($project->schedule) {
            $scheduleStatus = match ($validated['status']) {
                'SHOOTING' => 'SHOOTING',
                'COMPLETED', 'DELIVERED' => 'COMPLETED',
                'CANCELLED' => 'CANCELLED',
                default => 'SCHEDULED',
            };
            $project->schedule->update(['status' => $scheduleStatus]);
        }

        ActivityLogger::log('UPDATED', 'PROJECT', "Status project '{$project->project_name}' diubah menjadi {$validated['status']}.", $project->id);

        return back()->with('success', "Status project berhasil diubah menjadi {$validated['status']}.");
    }

    public function updateWorkDuration(Request $request, Project $project)
    {
        $validated = $request->validate([
            'work_start_time' => 'required',
            'work_end_time' => 'required',
        ]);

        $project->update($validated);

        ActivityLogger::log('UPDATED', 'PROJECT', "Durasi kerja project '{$project->project_name}' diperbarui.", $project->id);

        return back()->with('success', 'Durasi kerja project berhasil diperbarui.');
    }

    public function addPhotographer(Request $request, Project $project)
    {
        $validated = $request->validate([
            'photographer_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
        ]);

        if (! $project->photographers->contains($validated['photographer_id'])) {
            $project->photographers()->attach($validated['photographer_id']);
        }

        $project->photographerSalaries()->updateOrCreate(
            ['photographer_id' => $validated['photographer_id']],
            [
                'amount' => $validated['amount'],
                'work_start_time' => $project->work_start_time,
                'work_end_time' => $project->work_end_time,
                'payment_status' => 'UNPAID',
                'created_by' => auth()->id(),
            ]
        );

        $photographer = User::find($validated['photographer_id']);
        ActivityLogger::log('UPDATED', 'PROJECT', "Photographer '{$photographer->name}' ditambahkan ke project '{$project->project_name}'.", $project->id);

        return back()->with('success', "Photographer '{$photographer->name}' berhasil ditambahkan ke project.");
    }

    public function removePhotographer(Project $project, User $photographer)
    {
        $project->photographers()->detach($photographer->id);
        $project->photographerSalaries()->where('photographer_id', $photographer->id)->delete();

        ActivityLogger::log('UPDATED', 'PROJECT', "Photographer '{$photographer->name}' dihapus dari project '{$project->project_name}'.", $project->id);

        return back()->with('success', "Photographer '{$photographer->name}' berhasil dihapus dari project.");
    }

    public function addMua(Request $request, Project $project)
    {
        $validated = $request->validate([
            'mua_id' => 'required|exists:muas,id',
            'amount' => 'required|numeric|min:0',
        ]);

        if (! $project->muas->contains($validated['mua_id'])) {
            $project->muas()->attach($validated['mua_id']);
        }

        $project->muaFees()->updateOrCreate(
            ['mua_id' => $validated['mua_id']],
            [
                'amount' => $validated['amount'],
                'work_start_time' => $project->work_start_time,
                'work_end_time' => $project->work_end_time,
                'payment_status' => 'UNPAID',
                'created_by' => auth()->id(),
            ]
        );

        $mua = Mua::find($validated['mua_id']);
        ActivityLogger::log('UPDATED', 'PROJECT', "MUA '{$mua->name}' ditambahkan ke project '{$project->project_name}'.", $project->id);

        return back()->with('success', "MUA '{$mua->name}' berhasil ditambahkan ke project.");
    }

    public function removeMua(Project $project, Mua $mua)
    {
        $project->muas()->detach($mua->id);
        $project->muaFees()->where('mua_id', $mua->id)->delete();

        ActivityLogger::log('UPDATED', 'PROJECT', "MUA '{$mua->name}' dihapus dari project '{$project->project_name}'.", $project->id);

        return back()->with('success', "MUA '{$mua->name}' berhasil dihapus dari project.");
    }

    public function destroy(Project $project)
    {
        $name = $project->project_name;
        $project->delete();

        ActivityLogger::log('DELETED', 'PROJECT', "Project '{$name}' dihapus.", $project->id);

        return back()->with('success', "Project '{$name}' berhasil dihapus.");
    }
}
