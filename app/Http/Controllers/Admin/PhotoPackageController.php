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
        $query = PhotoPackage::with('mua');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('category', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');

        if (in_array($sort, ['name', 'price', 'category', 'status', 'created_at'])) {
            $query->orderBy($sort, $direction);
        }

        $packages = $query->paginate(12)->withQueryString();

        // Calculate sort by profit / margin if requested in memory or sort collection
        if (in_array($sort, ['profit', 'margin'])) {
            $sortedItems = $packages->getCollection()->sortBy(function ($item) use ($sort) {
                return $sort === 'profit' ? $item->estimated_profit : $item->estimated_margin;
            }, SORT_REGULAR, $direction === 'desc');

            $packages->setCollection($sortedItems->values());
        }

        return Inertia::render('Admin/Packages/Index', [
            'packages' => $packages,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'category' => (string) $request->input('category', ''),
                'status' => (string) $request->input('status', ''),
                'sort' => (string) $request->input('sort', 'created_at'),
                'direction' => (string) $request->input('direction', 'desc'),
            ],
            'categories' => ['Wedding', 'Graduation', 'Portrait', 'Product', 'Event', 'Prewedding', 'Commercial', 'Other'],
            'muas' => Mua::active()->get(['id', 'name', 'specialty']),
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
            'number_of_photographers' => 'required|integer|min:1',
            'includes_mua' => 'required|boolean',
            'mua_id' => 'nullable|exists:muas,id',
            'estimated_photographer_cost' => 'required|numeric|min:0',
            'estimated_mua_fee' => 'required|numeric|min:0',
            'estimated_operational_cost' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $package = PhotoPackage::create($validated);

        ActivityLogger::log('CREATED', 'PACKAGE', "Paket foto '{$package->name}' berhasil dibuat.", $package->id);

        return back()->with('success', "Paket foto '{$package->name}' berhasil dibuat.");
    }

    public function update(Request $request, PhotoPackage $package)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
            'number_of_photos' => 'required|integer|min:0',
            'number_of_photographers' => 'required|integer|min:1',
            'includes_mua' => 'required|boolean',
            'mua_id' => 'nullable|exists:muas,id',
            'estimated_photographer_cost' => 'required|numeric|min:0',
            'estimated_mua_fee' => 'required|numeric|min:0',
            'estimated_operational_cost' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $package->update($validated);

        ActivityLogger::log('UPDATED', 'PACKAGE', "Paket foto '{$package->name}' diperbarui.", $package->id);

        return back()->with('success', "Paket foto '{$package->name}' berhasil diperbarui.");
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
