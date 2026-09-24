<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PhotoPackage;
use App\Models\Mua;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PhotoPackageController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'all');

        $totalAll = PhotoPackage::count();
        $totalPhoto = PhotoPackage::where('category', '!=', 'MUA Only')->where('number_of_photographers', '>', 0)->count();
        $totalMua = PhotoPackage::where(function ($q) {
            $q->where('category', 'MUA Only')->orWhere('number_of_photographers', 0);
        })->count();

        $query = PhotoPackage::with('mua');

        if ($type === 'photo') {
            $query->where('category', '!=', 'MUA Only')->where('number_of_photographers', '>', 0);
        } elseif ($type === 'mua') {
            $query->where(function ($q) {
                $q->where('category', 'MUA Only')->orWhere('number_of_photographers', 0);
            });
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $sort = $request->input('sort', 'created_at');

        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'created_at':
            case 'all':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $packages = $query->paginate(12)->withQueryString();

        return Inertia::render('Admin/Packages/Index', [
            'packages' => $packages,
            'counts' => [
                'all' => $totalAll,
                'photo' => $totalPhoto,
                'mua' => $totalMua,
            ],
            'filters' => [
                'type' => (string) $type,
                'search' => (string) $request->input('search', ''),
                'category' => (string) $request->input('category', ''),
                'status' => (string) $request->input('status', ''),
                'sort' => (string) $request->input('sort', 'created_at'),
                'direction' => (string) $request->input('direction', 'desc'),
            ],
            'categories' => ['Wedding', 'Graduation', 'Portrait', 'Product', 'Event', 'Prewedding', 'Commercial', 'MUA Only', 'Other'],
            'muas' => Mua::active()->get(['id', 'name', 'specialty', 'default_fee']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
            'number_of_photos' => 'required|integer|min:0',
            'number_of_photographers' => 'required|integer|min:0',
            'includes_mua' => 'required|boolean',
            'mua_id' => 'nullable|exists:muas,id',
            'estimated_photographer_cost' => 'required|numeric|min:0',
            'estimated_mua_fee' => 'required|numeric|min:0',
            'estimated_operational_cost' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        if ($validated['category'] === 'MUA Only' || $request->input('package_type') === 'mua') {
            $validated['category'] = 'MUA Only';
            $validated['includes_mua'] = true;
            $validated['number_of_photographers'] = 0;
            $validated['number_of_photos'] = 0;
            $validated['estimated_photographer_cost'] = 0;
        }

        $package = PhotoPackage::create($validated);

        ActivityLogger::log('CREATED', 'PACKAGE', "Paket '{$package->name}' berhasil dibuat.", $package->id);

        return back()->with('success', "Paket '{$package->name}' berhasil dibuat.");
    }

    public function update(Request $request, PhotoPackage $package)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
            'number_of_photos' => 'required|integer|min:0',
            'number_of_photographers' => 'required|integer|min:0',
            'includes_mua' => 'required|boolean',
            'mua_id' => 'nullable|exists:muas,id',
            'estimated_photographer_cost' => 'required|numeric|min:0',
            'estimated_mua_fee' => 'required|numeric|min:0',
            'estimated_operational_cost' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        if ($validated['category'] === 'MUA Only' || $request->input('package_type') === 'mua') {
            $validated['category'] = 'MUA Only';
            $validated['includes_mua'] = true;
            $validated['number_of_photographers'] = 0;
            $validated['number_of_photos'] = 0;
            $validated['estimated_photographer_cost'] = 0;
        }

        $package->update($validated);

        ActivityLogger::log('UPDATED', 'PACKAGE', "Paket '{$package->name}' diperbarui.", $package->id);

        return back()->with('success', "Paket '{$package->name}' berhasil diperbarui.");
    }

    public function duplicate(PhotoPackage $package)
    {
        $newPackage = $package->replicate();
        $newPackage->name = $package->name . ' (Copy)';
        $newPackage->save();

        ActivityLogger::log('CREATED', 'PACKAGE', "Menduplikasi paket foto '{$package->name}' menjadi '{$newPackage->name}'.", $newPackage->id);

        return back()->with('success', "Paket '{$package->name}' berhasil diduplikasi.");
    }

    public function toggleStatus(PhotoPackage $package)
    {
        $newStatus = $package->status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        $package->update(['status' => $newStatus]);

        ActivityLogger::log($newStatus === 'ACTIVE' ? 'ACTIVATED' : 'DEACTIVATED', 'PACKAGE', "Status paket '{$package->name}' diubah menjadi {$newStatus}.", $package->id);

        return back()->with('success', "Status paket '{$package->name}' berhasil diubah.");
    }

    public function destroy(PhotoPackage $package)
    {
        $name = $package->name;
        $package->delete();

        ActivityLogger::log('DELETED', 'PACKAGE', "Paket foto '{$name}' dihapus (soft delete).", $package->id);

        return back()->with('success', "Paket '{$name}' berhasil dihapus.");
    }
}
