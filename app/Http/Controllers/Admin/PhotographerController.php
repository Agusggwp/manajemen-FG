<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PhotographerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::photographer();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('specialty', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $photographers = $query->withCount('projects')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Photographers/Index', [
            'photographers' => $photographers,
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
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'specialty' => 'nullable|string',
            'bio' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $validated['role'] = 'PHOTOGRAPHER';
        $validated['password'] = Hash::make($validated['password']);

        $photographer = User::create($validated);

        ActivityLogger::log('CREATED', 'PHOTOGRAPHER', "Photographer '{$photographer->name}' ditambahkan.", $photographer->id);

        return back()->with('success', "Photographer '{$photographer->name}' berhasil ditambahkan.");
    }

    public function update(Request $request, User $photographer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $photographer->id,
            'password' => 'nullable|string|min:6',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'specialty' => 'nullable|string',
            'bio' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $photographer->update($validated);

        ActivityLogger::log('UPDATED', 'PHOTOGRAPHER', "Data photographer '{$photographer->name}' diperbarui.", $photographer->id);

        return back()->with('success', "Data photographer '{$photographer->name}' berhasil diperbarui.");
    }

    public function destroy(User $photographer)
    {
        $name = $photographer->name;
        $photographer->delete();

        ActivityLogger::log('DELETED', 'PHOTOGRAPHER', "Photographer '{$name}' dihapus.", $photographer->id);

        return back()->with('success', "Photographer '{$name}' berhasil dihapus.");
    }
}
