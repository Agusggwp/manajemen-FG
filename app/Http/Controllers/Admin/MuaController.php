<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mua;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
            'email' => 'nullable|email|max:255|unique:users,email',
            'password' => 'nullable|string|min:6',
            'phone' => 'required|string|max:50',
            'address' => 'nullable|string',
            'specialty' => 'nullable|string',
            'bio' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
            'notes' => 'nullable|string',
            'default_fee' => 'nullable|numeric|min:0',
        ]);

        $password = $validated['password'] ?? 'password';
        unset($validated['password']);

        // Create user account if email provided
        $userId = null;
        if (! empty($validated['email'])) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($password),
                'role' => 'MUA',
                'phone' => $validated['phone'],
                'address' => $validated['address'] ?? null,
                'specialty' => $validated['specialty'] ?? null,
                'bio' => $validated['bio'] ?? null,
                'status' => $validated['status'],
                'email_verified_at' => now(),
            ]);
            $userId = $user->id;
        }

        $validated['user_id'] = $userId;
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
        $userUniqueRule = $mua->user_id ? 'unique:users,email,' . $mua->user_id : 'unique:users,email';

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|' . $userUniqueRule,
            'password' => 'nullable|string|min:6',
            'phone' => 'required|string|max:50',
            'address' => 'nullable|string',
            'specialty' => 'nullable|string',
            'bio' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
            'notes' => 'nullable|string',
            'default_fee' => 'nullable|numeric|min:0',
        ]);

        $password = $validated['password'] ?? null;
        unset($validated['password']);

        // Sync or create linked User account
        if (! empty($validated['email'])) {
            if ($mua->user_id && ($user = User::find($mua->user_id))) {
                $userUpdates = [
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'],
                    'address' => $validated['address'] ?? null,
                    'specialty' => $validated['specialty'] ?? null,
                    'bio' => $validated['bio'] ?? null,
                    'status' => $validated['status'],
                ];
                if (! empty($password)) {
                    $userUpdates['password'] = Hash::make($password);
                }
                $user->update($userUpdates);
            } else {
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($password ?: 'password'),
                    'role' => 'MUA',
                    'phone' => $validated['phone'],
                    'address' => $validated['address'] ?? null,
                    'specialty' => $validated['specialty'] ?? null,
                    'bio' => $validated['bio'] ?? null,
                    'status' => $validated['status'],
                    'email_verified_at' => now(),
                ]);
                $validated['user_id'] = $user->id;
            }
        }

        $mua->update($validated);

        ActivityLogger::log('UPDATED', 'MUA', "Data MUA '{$mua->name}' diperbarui.", $mua->id);

        return back()->with('success', "Data MUA '{$mua->name}' berhasil diperbarui.");
    }

    public function activate(Mua $mua)
    {
        $mua->update(['status' => 'ACTIVE']);
        if ($mua->user_id && ($user = User::find($mua->user_id))) {
            $user->update([
                'status' => 'ACTIVE',
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);
        }

        ActivityLogger::log(
            'ACTIVATED',
            'MUA',
            "Akun MUA '{$mua->name}' ({$mua->email}) disetujui & diaktifkan oleh Admin.",
            $mua->id
        );

        return back()->with('success', "Akun MUA '{$mua->name}' berhasil disetujui dan diaktifkan!");
    }

    public function destroy(Mua $mua)
    {
        $name = $mua->name;
        $mua->delete();

        ActivityLogger::log('DELETED', 'MUA', "MUA '{$name}' dihapus (soft delete).", $mua->id);

        return back()->with('success', "MUA '{$name}' berhasil dihapus.");
    }
}
