<?php

namespace App\Http\Controllers\Mua;

use App\Http\Controllers\Controller;
use App\Models\Mua;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
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

        $query = Project::with(['customer', 'photoPackage', 'photographers', 'schedule'])
            ->whereHas('muas', function ($q) use ($muaId) {
                $q->where('muas.id', $muaId);
            });

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('project_code', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%")
                    ->orWhere('location_name', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $projects = $query->orderBy('date', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Mua/Projects/Index', [
            'projects' => $projects,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'status' => (string) $request->input('status', ''),
            ],
        ]);
    }

    public function show(Project $project)
    {
        $muaId = $this->getMuaId();

        $hasAccess = $project->muas()->where('muas.id', $muaId)->exists();

        if (! $hasAccess && auth()->user()->role !== 'ADMIN') {
            abort(403, 'Anda tidak memiliki akses ke project ini.');
        }

        $project->load([
            'customer',
            'photoPackage',
            'schedule',
            'photographers',
            'muaFees' => function ($q) use ($muaId) {
                $q->where('mua_id', $muaId);
            },
        ]);

        return Inertia::render('Mua/Projects/Show', [
            'project' => $project,
        ]);
    }
}
