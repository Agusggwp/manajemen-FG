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
                $q->whereHas('customer', fn($c) => $c->where('name', 'like', "%{$search}%"))
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

        $existingAssignments = Schedule::where('status', '!=', 'CANCELLED')
            ->with(['project.photographers:id,name', 'customer:id,name'])
            ->get(['id', 'date', 'start_time', 'end_time', 'status', 'customer_id', 'location_name'])
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'date' => is_string($s->date) ? $s->date : $s->date->format('Y-m-d'),
                    'start_time' => substr($s->start_time, 0, 5),
                    'end_time' => substr($s->end_time, 0, 5),
                    'customer_name' => $s->customer ? $s->customer->name : '',
                    'location_name' => $s->location_name,
                    'photographer_ids' => $s->project ? $s->project->photographers->pluck('id')->toArray() : [],
                ];
            });

        return Inertia::render('Admin/Schedules/Index', [
            'schedules' => $schedules,
            'existingAssignments' => $existingAssignments,
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'date' => (string) $request->input('date', ''),
                'status' => (string) $request->input('status', ''),
            ],
            'customers' => Customer::all(['id', 'name', 'phone']),
            'packages' => PhotoPackage::active()->with('mua')->get(['id', 'name', 'price', 'duration_minutes', 'includes_mua', 'category', 'mua_id', 'estimated_mua_fee']),
            'photographers' => User::photographer()->active()->get(['id', 'name', 'specialty']),
            'muas' => Mua::active()->get(['id', 'name', 'specialty', 'default_fee']),
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
            // Mandatory Shooting Location
            'location_name' => 'required|string|max:255',
            'location_address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'location_radius' => 'required|integer|min:10|max:5000',
            'location_notes' => 'nullable|string',
            // MUA Location
            'mua_same_as_shooting_location' => 'nullable|boolean',
            'mua_location_name' => 'nullable|string|max:255',
            'mua_location_address' => 'nullable|string',
            'mua_latitude' => 'nullable|numeric',
            'mua_longitude' => 'nullable|numeric',
            'mua_location_radius' => 'nullable|integer|min:10|max:5000',
            'mua_location_notes' => 'nullable|string',
            'notes' => 'nullable|string',
            'photographer_ids' => 'required|array|min:1',
            'photographer_ids.*' => 'exists:users,id',
            'mua_ids' => 'nullable|array',
            'mua_ids.*' => 'exists:muas,id',
            'photographer_salary' => 'nullable|numeric|min:0',
            'mua_fee' => 'nullable|numeric|min:0',
            'overtime_hours' => 'nullable|integer|min:0|max:24',
            'overtime_fee' => 'nullable|numeric|min:0',
        ]);

        $overtimeHours = (int) ($validated['overtime_hours'] ?? 0);
        $overtimeFee = (float) ($validated['overtime_fee'] ?? 0);

        $muaSame = $request->boolean('mua_same_as_shooting_location', true);
        $muaLocationName = $muaSame ? $validated['location_name'] : ($validated['mua_location_name'] ?? $validated['location_name']);
        $muaLocationAddress = $muaSame ? $validated['location_address'] : ($validated['mua_location_address'] ?? $validated['location_address']);
        $muaLatitude = $muaSame ? $validated['latitude'] : ($validated['mua_latitude'] ?? $validated['latitude']);
        $muaLongitude = $muaSame ? $validated['longitude'] : ($validated['mua_longitude'] ?? $validated['longitude']);
        $muaLocationRadius = $muaSame ? $validated['location_radius'] : ($validated['mua_location_radius'] ?? $validated['location_radius']);
        $muaLocationNotes = $muaSame ? ($validated['location_notes'] ?? null) : ($validated['mua_location_notes'] ?? null);

        // Validate Photographer availability (check for overlapping schedules)
        foreach ($validated['photographer_ids'] as $photographerId) {
            $conflict = Schedule::where('status', '!=', 'CANCELLED')
                ->whereDate('date', $validated['date'])
                ->where('start_time', '<', $validated['end_time'])
                ->where('end_time', '>', $validated['start_time'])
                ->whereHas('project.photographers', function ($q) use ($photographerId) {
                    $q->where('users.id', $photographerId);
                })
                ->first();

            if ($conflict) {
                $photographer = User::find($photographerId);
                $startTimeStr = substr($conflict->start_time, 0, 5);
                $endTimeStr = substr($conflict->end_time, 0, 5);
                return back()->withErrors([
                    'photographer_ids' => "Photographer '{$photographer->name}' tidak dapat dipilih karena sudah memiliki jadwal di waktu yang sama ({$startTimeStr} - {$endTimeStr}).",
                ]);
            }
        }

        $package = PhotoPackage::findOrFail($validated['photo_package_id']);
        $customer = Customer::findOrFail($validated['customer_id']);

        // Create Booking with Package Snapshot & Overtime
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
            'overtime_hours' => $overtimeHours,
            'overtime_fee' => $overtimeFee,
        ]);

        // Create Schedule
        $schedule = Schedule::create([
            'booking_id' => $booking->id,
            'customer_id' => $customer->id,
            'photo_package_id' => $package->id,
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'overtime_hours' => $overtimeHours,
            'overtime_fee' => $overtimeFee,
            'location_name' => $validated['location_name'],
            'location_address' => $validated['location_address'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'location_radius' => $validated['location_radius'],
            'location_notes' => $validated['location_notes'] ?? null,
            'mua_same_as_shooting_location' => $muaSame,
            'mua_location_name' => $muaLocationName,
            'mua_location_address' => $muaLocationAddress,
            'mua_latitude' => $muaLatitude,
            'mua_longitude' => $muaLongitude,
            'mua_location_radius' => $muaLocationRadius,
            'mua_location_notes' => $muaLocationNotes,
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
            'overtime_hours' => $overtimeHours,
            'overtime_fee' => $overtimeFee,
            'date' => $validated['date'],
            'location_name' => $validated['location_name'],
            'location_address' => $validated['location_address'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'location_radius' => $validated['location_radius'],
            'mua_same_as_shooting_location' => $muaSame,
            'mua_location_name' => $muaLocationName,
            'mua_location_address' => $muaLocationAddress,
            'mua_latitude' => $muaLatitude,
            'mua_longitude' => $muaLongitude,
            'mua_location_radius' => $muaLocationRadius,
            'mua_location_notes' => $muaLocationNotes,
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
            ]);
        }

        // Determine MUAs: take directly from package if set, else fallback to mua_ids
        $muaIds = [];
        if ($package->mua_id) {
            $muaIds[] = $package->mua_id;
        } elseif (! empty($validated['mua_ids'])) {
            $muaIds = $validated['mua_ids'];
        }

        // Attach MUAs if applicable
        if (! empty($muaIds)) {
            $project->muas()->attach($muaIds);
            $muaFeeAmount = $validated['mua_fee'] ?? $package->estimated_mua_fee;
            foreach ($muaIds as $muaId) {
                $project->muaFees()->create([
                    'mua_id' => $muaId,
                    'amount' => $muaFeeAmount,
                    'work_start_time' => $validated['start_time'],
                    'work_end_time' => $validated['end_time'],
                    'payment_status' => 'UNPAID',
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
            'overtime_hours' => 'nullable|integer|min:0|max:24',
            'overtime_fee' => 'nullable|numeric|min:0',
            // Mandatory Shooting Location
            'location_name' => 'required|string|max:255',
            'location_address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'location_radius' => 'required|integer|min:10|max:5000',
            'location_notes' => 'nullable|string',
            // MUA Location
            'mua_same_as_shooting_location' => 'nullable|boolean',
            'mua_location_name' => 'nullable|string|max:255',
            'mua_location_address' => 'nullable|string',
            'mua_latitude' => 'nullable|numeric',
            'mua_longitude' => 'nullable|numeric',
            'mua_location_radius' => 'nullable|integer|min:10|max:5000',
            'mua_location_notes' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'required|in:SCHEDULED,SHOOTING,COMPLETED,CANCELLED',
        ]);

        $muaSame = $request->boolean('mua_same_as_shooting_location', true);
        $validated['mua_same_as_shooting_location'] = $muaSame;
        $validated['mua_location_name'] = $muaSame ? $validated['location_name'] : ($validated['mua_location_name'] ?? $validated['location_name']);
        $validated['mua_location_address'] = $muaSame ? $validated['location_address'] : ($validated['mua_location_address'] ?? $validated['location_address']);
        $validated['mua_latitude'] = $muaSame ? $validated['latitude'] : ($validated['mua_latitude'] ?? $validated['latitude']);
        $validated['mua_longitude'] = $muaSame ? $validated['longitude'] : ($validated['mua_longitude'] ?? $validated['longitude']);
        $validated['mua_location_radius'] = $muaSame ? $validated['location_radius'] : ($validated['mua_location_radius'] ?? $validated['location_radius']);
        $validated['mua_location_notes'] = $muaSame ? ($validated['location_notes'] ?? null) : ($validated['mua_location_notes'] ?? null);

        $schedule->update($validated);

        if ($schedule->booking) {
            $schedule->booking->update([
                'overtime_hours' => $validated['overtime_hours'] ?? 0,
                'overtime_fee' => $validated['overtime_fee'] ?? 0,
            ]);
        }

        if ($schedule->project) {
            $schedule->project->update([
                'date' => $validated['date'],
                'location_name' => $validated['location_name'],
                'location_address' => $validated['location_address'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'location_radius' => $validated['location_radius'],
                'mua_same_as_shooting_location' => $muaSame,
                'mua_location_name' => $validated['mua_location_name'],
                'mua_location_address' => $validated['mua_location_address'],
                'mua_latitude' => $validated['mua_latitude'],
                'mua_longitude' => $validated['mua_longitude'],
                'mua_location_radius' => $validated['mua_location_radius'],
                'mua_location_notes' => $validated['mua_location_notes'],
                'work_start_time' => $validated['start_time'],
                'work_end_time' => $validated['end_time'],
                'overtime_hours' => $validated['overtime_hours'] ?? 0,
                'overtime_fee' => $validated['overtime_fee'] ?? 0,
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

    public function sendReminder(Schedule $schedule)
    {
        $schedule->load(['customer', 'photoPackage', 'project.photographers', 'project.muas']);

        $customerSent = false;
        $photographersCount = 0;
        $muasCount = 0;

        if ($schedule->customer && ! empty($schedule->customer->email)) {
            try {
                \Illuminate\Support\Facades\Mail::to($schedule->customer->email)
                    ->send(new \App\Mail\CustomerPhotoSessionReminderMail($schedule));
                $customerSent = true;
            } catch (\Exception $e) {
                return back()->with('error', "Gagal mengirim email ke pelanggan: {$e->getMessage()}");
            }
        }

        if ($schedule->project) {
            foreach ($schedule->project->photographers as $photographer) {
                if (! empty($photographer->email)) {
                    try {
                        \Illuminate\Support\Facades\Mail::to($photographer->email)
                            ->send(new \App\Mail\PhotographerPhotoSessionReminderMail($schedule, $photographer));
                        $photographersCount++;
                    } catch (\Exception $e) {
                        // ignore/log
                    }
                }
            }

            foreach ($schedule->project->muas as $mua) {
                if (! empty($mua->email)) {
                    try {
                        \Illuminate\Support\Facades\Mail::to($mua->email)
                            ->send(new \App\Mail\MuaPhotoSessionReminderMail($schedule, $mua));
                        $muasCount++;
                    } catch (\Exception $e) {
                        // ignore/log
                    }
                }
            }
        }

        $schedule->update(['reminder_sent_at' => now()]);

        $logMsg = "Email pengingat manual dikirim untuk Jadwal #{$schedule->id} ({$schedule->location_name}). Pelanggan: " . ($customerSent ? 'Ya' : 'Tidak') . ", Fotografer: {$photographersCount}, MUA: {$muasCount}.";

        ActivityLogger::log('EMAIL_REMINDER_SENT', 'SCHEDULE', $logMsg, $schedule->id);

        return back()->with('success', "Email peringatan berhasil dikirim ke Pelanggan, Fotografer ({$photographersCount}), dan MUA ({$muasCount}).");
    }
}
