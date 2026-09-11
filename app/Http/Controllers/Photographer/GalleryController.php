<?php

namespace App\Http\Controllers\Photographer;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectGallery;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        $photographerId = auth()->id();

        $projects = Project::with(['customer', 'photoPackage', 'galleries'])
            ->whereHas('photographers', function ($q) use ($photographerId) {
                $q->where('users.id', $photographerId);
            })
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('Photographer/Gallery/Index', [
            'projects' => $projects,
        ]);
    }

    public function store(Request $request, Project $project)
    {
        $photographerId = auth()->id();

        if (! $project->photographers->contains($photographerId)) {
            abort(403, 'Anda tidak ditugaskan pada project ini.');
        }

        $validated = $request->validate([
            'photos' => 'required|array|min:1',
            'photos.*' => 'image|mimes:jpeg,png,jpg,webp|max:20480',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $uploadedCount = 0;
        foreach ($request->file('photos') as $photo) {
            $path = $photo->store('galleries/' . $project->id, 'public');
            ProjectGallery::create([
                'project_id' => $project->id,
                'photographer_id' => $photographerId,
                'file_path' => $path,
                'file_name' => $photo->getClientOriginalName(),
                'file_size' => $photo->getSize(),
                'title' => $validated['title'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);
            $uploadedCount++;
        }

        ActivityLogger::log('UPLOADED', 'GALLERY', "Photographer mengunggah {$uploadedCount} foto galeri ke project '{$project->project_name}'.", $project->id);

        return back()->with('success', "{$uploadedCount} foto galeri berhasil diunggah.");
    }
}
