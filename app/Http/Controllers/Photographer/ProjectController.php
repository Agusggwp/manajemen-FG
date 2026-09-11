<?php

namespace App\Http\Controllers\Photographer;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $photographerId = auth()->id();

        $projects = Project::with(['customer', 'photoPackage', 'schedule'])
            ->whereHas('photographers', function ($q) use ($photographerId) {
                $q->where('users.id', $photographerId);
            })
            ->orderBy('date', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Photographer/Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function show(Project $project)
    {
        $photographerId = auth()->id();

        // Server-side authorization verification
        if (! $project->photographers->contains($photographerId)) {
            abort(403, 'Anda tidak ditugaskan pada project ini.');
        }

        $project->load([
            'customer',
            'photoPackage',
            'schedule',
            'photographers',
            'muas',
            'proofs' => function ($q) use ($photographerId) {
                $q->where('photographer_id', $photographerId);
            },
            'galleries' => function ($q) use ($photographerId) {
                $q->where('photographer_id', $photographerId);
            },
        ]);

        $mySalary = $project->photographerSalaries()
            ->where('photographer_id', $photographerId)
            ->first();

        return Inertia::render('Photographer/Projects/Show', [
            'project' => $project,
            'mySalary' => $mySalary,
        ]);
    }
}
