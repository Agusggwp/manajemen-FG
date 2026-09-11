<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mua;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MuaController extends Controller
{
    public function index(Request $request)
    {
        $query = Mua::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('specialty', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $muas = $query->withCount('projects')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Muas/Index', [
            'muas' => $muas,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'status' => (string) $request->input('status', ''),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'nullable|string',
            'specialty' => 'nullable|string',
            'bio' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
            'notes' => 'nullable|string',
        ]);

        $mua = Mua::create($validated);

        ActivityLogger::log('CREATED', 'MUA', "MUA '{$mua->name}' berhasil ditambahkan.", $mua->id);

        return back()->with('success', "MUA '{$mua->name}' berhasil ditambahkan.");
    }

    public function show(Mua $mua)
    {
        $mua->load(['projects.customer', 'projects.photoPackage', 'projectFees.project']);

        return Inertia::render('Admin/Muas/Show', [
            'mua' => $mua,
        ]);
    }

    public function update(Request $request, Mua $mua)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'nullable|string',
            'specialty' => 'nullable|string',
            'bio' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
            'notes' => 'nullable|string',
        ]);

        $mua->update($validated);

        ActivityLogger::log('UPDATED', 'MUA', "Data MUA '{$mua->name}' diperbarui.", $mua->id);

        return back()->with('success', "Data MUA '{$mua->name}' berhasil diperbarui.");
    }

    public function destroy(Mua $mua)
    {
        $name = $mua->name;
        $mua->delete();

        ActivityLogger::log('DELETED', 'MUA', "MUA '{$name}' dihapus (soft delete).", $mua->id);

        return back()->with('success', "MUA '{$name}' berhasil dihapus.");
    }
}
