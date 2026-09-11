<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->withCount('projects')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => [
                'search' => (string) $request->input('search', ''),
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
            'notes' => 'nullable|string',
        ]);

        $customer = Customer::create($validated);

        ActivityLogger::log('CREATED', 'CUSTOMER', "Pelanggan '{$customer->name}' ditambahkan.", $customer->id);

        return back()->with('success', "Pelanggan '{$customer->name}' berhasil ditambahkan.");
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $customer->update($validated);

        ActivityLogger::log('UPDATED', 'CUSTOMER', "Data pelanggan '{$customer->name}' diperbarui.", $customer->id);

        return back()->with('success', "Data pelanggan '{$customer->name}' berhasil diperbarui.");
    }

    public function destroy(Customer $customer)
    {
        $name = $customer->name;
        $customer->delete();

        ActivityLogger::log('DELETED', 'CUSTOMER', "Pelanggan '{$name}' dihapus.", $customer->id);

        return back()->with('success', "Pelanggan '{$name}' berhasil dihapus.");
    }
}
