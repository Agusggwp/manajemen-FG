<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Mua;
use App\Models\PhotoPackage;
use App\Models\Project;
use App\Models\Schedule;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = Schedule::with(['customer', 'photoPackage', 'project.photographers', 'project.muas']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('customer', fn ($c) => $c->where('name', 'like', "%{$search}%"))
                    ->orWhere('location_name', 'like', "%{$search}%")
                    ->orWhere('location_address', 'like', "%{$search}%");
            });
        }

        if ($date = $request->input('date')) {
            $query->whereDate('date', $date);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $schedules = $query->orderBy('date', 'desc')->orderBy('start_time', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Schedules/Index', [
            'schedules' => $schedules,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'date' => (string) $request->input('date', ''),
                'status' => (string) $request->input('status', ''),
            ],
            'customers' => Customer::all(['id', 'name', 'phone']),
            'packages' => PhotoPackage::active()->get(['id', 'name', 'price', 'duration_minutes', 'includes_mua', 'category']),
            'photographers' => User::photographer()->active()->get(['id', 'name', 'specialty']),
            'muas' => Mua::active()->get(['id', 'name', 'specialty']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'photo_package_id' => 'required|exists:photo_packages,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            // Mandatory Location
            'location_name' => 'required|string|max:255',
            'location_address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'location_radius' => 'required|integer|min:10|max:5000',
            'location_notes' => 'nullable|string',
            'notes' => 'nullable|string',
            'photographer_ids' => 'required|array|min:1',
            'photographer_ids.*' => 'exists:users,id',
            'mua_ids' => 'nullable|array',
            'mua_ids.*' => 'exists:muas,id',
            'photographer_salary' => 'nullable|numeric|min:0',
            'mua_fee' => 'nullable|numeric|min:0',
        ]);

        $package = PhotoPackage::findOrFail($validated['photo_package_id']);
        $customer = Customer::findOrFail($validated['customer_id']);

        // Create Booking with Package Snapshot
        $booking = Booking::create([
            'booking_code' => 'BOOK-' . strtoupper(substr(md5(uniqid()), 0, 6)),
            'customer_id' => $customer->id,
            'photo_package_id' => $package->id,
            'booking_date' => $validated['date'],
            'status' => 'CONFIRMED',
            'notes' => $validated['notes'] ?? null,
            'package_name' => $package->name,
            'package_price' => $package->price,
            'package_duration' => $package->duration_minutes,
            'package_includes_mua' => $package->includes_mua,
        ]);

        // Create Schedule
        $schedule = Schedule::create([
            'booking_id' => $booking->id,
            'customer_id' => $customer->id,
            'photo_package_id' => $package->id,
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'location_name' => $validated['location_name'],
            'location_address' => $validated['location_address'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'location_radius' => $validated['location_radius'],
            'location_notes' => $validated['location_notes'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'SCHEDULED',
        ]);

        // Auto Create Project from Schedule
        $project = Project::create([
            'project_code' => 'PRJ-' . strtoupper(substr(md5(uniqid()), 0, 6)),
            'project_name' => "{$package->name} - {$customer->name}",
            'booking_id' => $booking->id,
            'schedule_id' => $schedule->id,
            'customer_id' => $customer->id,
            'photo_package_id' => $package->id,
            'package_name' => $package->name,
            'package_price' => $package->price,
            'package_duration' => $package->duration_minutes,
            'package_includes_mua' => $package->includes_mua,
            'date' => $validated['date'],
            'location_name' => $validated['location_name'],
            'location_address' => $validated['location_address'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'location_radius' => $validated['location_radius'],
            'status' => 'SCHEDULED',
            'work_start_time' => $validated['start_time'],
            'work_end_time' => $validated['end_time'],
        ]);

        // Attach Photographers
        $project->photographers()->attach($validated['photographer_ids']);

        // Create Photographer Salary per project
        $photographerSalaryAmount = $validated['photographer_salary'] ?? $package->estimated_photographer_cost;
        foreach ($validated['photographer_ids'] as $photographerId) {
            $project->photographerSalaries()->create([
                'photographer_id' => $photographerId,
                'amount' => $photographerSalaryAmount,
                'work_start_time' => $validated['start_time'],
                'work_end_time' => $validated['end_time'],
                'payment_status' => 'UNPAID',
                'created_by' => auth()->id(),
            ]);
        }

        // Attach MUAs if applicable
        if (! empty($validated['mua_ids'])) {
            $project->muas()->attach($validated['mua_ids']);
            $muaFeeAmount = $validated['mua_fee'] ?? $package->estimated_mua_fee;
            foreach ($validated['mua_ids'] as $muaId) {
                $project->muaFees()->create([
                    'mua_id' => $muaId,
                    'amount' => $muaFeeAmount,
                    'work_start_time' => $validated['start_time'],
                    'work_end_time' => $validated['end_time'],
                    'payment_status' => 'UNPAID',
                    'created_by' => auth()->id(),
                ]);
            }
        }

        ActivityLogger::log('CREATED', 'SCHEDULE', "Jadwal baru '{$project->project_name}' berhasil dibuat dengan lokasi {$schedule->location_name}.", $schedule->id);

        return back()->with('success', "Jadwal dan Project untuk {$customer->name} berhasil dibuat.");
    }

    public function show(Schedule $schedule)
    {
        $schedule->load(['customer', 'photoPackage', 'booking', 'project.photographers', 'project.muas', 'project.photographerSalaries', 'project.muaFees', 'proofs.photographer']);

        return Inertia::render('Admin/Schedules/Show', [
            'schedule' => $schedule,
        ]);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'location_name' => 'required|string|max:255',
            'location_address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'location_radius' => 'required|integer|min:10|max:5000',
            'location_notes' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'required|in:SCHEDULED,SHOOTING,COMPLETED,CANCELLED',
        ]);

        $schedule->update($validated);

        if ($schedule->project) {
            $schedule->project->update([
                'date' => $validated['date'],
                'location_name' => $validated['location_name'],
                'location_address' => $validated['location_address'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'location_radius' => $validated['location_radius'],
                'work_start_time' => $validated['start_time'],
                'work_end_time' => $validated['end_time'],
            ]);
        }

        ActivityLogger::log('UPDATED', 'SCHEDULE', "Jadwal ID {$schedule->id} diperbarui.", $schedule->id);

        return back()->with('success', "Jadwal berhasil diperbarui.");
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        ActivityLogger::log('DELETED', 'SCHEDULE', "Jadwal ID {$schedule->id} dihapus.", $schedule->id);

        return back()->with('success', 'Jadwal berhasil dihapus.');
    }
}
