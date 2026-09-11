<?php

namespace App\Http\Controllers\Photographer;

use App\Http\Controllers\Controller;
use App\Models\PhotoSessionProof;
use App\Models\Schedule;
use App\Services\ActivityLogger;
use App\Utils\GeoUtils;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProofController extends Controller
{
    public function create(Schedule $schedule, string $type)
    {
        $photographerId = auth()->id();
        $type = strtoupper($type);

        if (! in_array($type, ['START', 'END'])) {
            abort(404, 'Tipe bukti tidak valid.');
        }

        // Server-side authorization check
        $isAssigned = $schedule->project && $schedule->project->photographers->contains($photographerId);
        if (! $isAssigned) {
            abort(403, 'Anda tidak ditugaskan pada jadwal ini.');
        }

        $schedule->load(['customer', 'photoPackage', 'project', 'proofs']);

        // Tanggal & Waktu Jadwal
        $dateStr = $schedule->date instanceof \Carbon\Carbon
            ? $schedule->date->format('Y-m-d')
            : Carbon::parse($schedule->date)->format('Y-m-d');
        $startTimeStr = substr($schedule->start_time, 0, 5);
        $scheduleStartDateTime = Carbon::parse("{$dateStr} {$startTimeStr}");

        $existingStartProof = PhotoSessionProof::where('schedule_id', $schedule->id)
            ->where('photographer_id', $photographerId)
            ->where('type', 'START')
            ->first();

        $existingEndProof = PhotoSessionProof::where('schedule_id', $schedule->id)
            ->where('photographer_id', $photographerId)
            ->where('type', 'END')
            ->first();

        // 1. VALIDASI START: hanya saat sudah waktunya dan belum pernah kirim START
        if ($type === 'START') {
            if (Carbon::now()->lt($scheduleStartDateTime)) {
                return redirect()->route('photographer.schedules.show', $schedule->id)
                    ->with('error', "Jadwal pemotretan belum waktunya dimulai. Tanggal: {$dateStr}, Jam: {$startTimeStr}.");
            }

            if ($existingStartProof) {
                return redirect()->route('photographer.schedules.show', $schedule->id)
                    ->with('error', 'Anda sudah pernah mengirimkan bukti foto START untuk jadwal ini (maksimal 1 kali per projek).');
            }
        }

        // 2. VALIDASI END: harus sudah kirim START dan belum pernah kirim END
        if ($type === 'END') {
            if (! $existingStartProof) {
                return redirect()->route('photographer.schedules.show', $schedule->id)
                    ->with('error', 'Anda harus mengambil foto bukti START terlebih dahulu sebelum menyelesaikan pemotretan.');
            }

            if ($existingEndProof) {
                return redirect()->route('photographer.schedules.show', $schedule->id)
                    ->with('error', 'Anda sudah pernah mengirimkan bukti foto SELESAI (END) untuk jadwal ini (maksimal 1 kali per projek).');
            }
        }

        $existingProof = $type === 'START' ? $existingStartProof : $existingEndProof;

        return Inertia::render('Photographer/Proof/Create', [
            'schedule' => $schedule,
            'type' => $type,
            'existingProof' => $existingProof,
        ]);
    }

    public function store(Request $request, Schedule $schedule)
    {
        $photographerId = auth()->id();

        // Server-side authorization
        $isAssigned = $schedule->project && $schedule->project->photographers->contains($photographerId);
        if (! $isAssigned) {
            abort(403, 'Anda tidak ditugaskan pada jadwal ini.');
        }

        $validated = $request->validate([
            'type' => 'required|in:START,END',
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240', // max 10MB
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'accuracy' => 'required|numeric',
        ]);

        $type = strtoupper($validated['type']);

        $dateStr = $schedule->date instanceof \Carbon\Carbon
            ? $schedule->date->format('Y-m-d')
            : Carbon::parse($schedule->date)->format('Y-m-d');
        $startTimeStr = substr($schedule->start_time, 0, 5);
        $scheduleStartDateTime = Carbon::parse("{$dateStr} {$startTimeStr}");

        $existingStartProof = PhotoSessionProof::where('schedule_id', $schedule->id)
            ->where('photographer_id', $photographerId)
            ->where('type', 'START')
            ->first();

        $existingEndProof = PhotoSessionProof::where('schedule_id', $schedule->id)
            ->where('photographer_id', $photographerId)
            ->where('type', 'END')
            ->first();

        if ($type === 'START') {
            if (Carbon::now()->lt($scheduleStartDateTime)) {
                return redirect()->route('photographer.schedules.show', $schedule->id)
                    ->with('error', "Jadwal pemotretan belum waktunya dimulai. Tanggal: {$dateStr}, Jam: {$startTimeStr}.");
            }

            if ($existingStartProof) {
                return redirect()->route('photographer.schedules.show', $schedule->id)
                    ->with('error', 'Anda sudah pernah mengirimkan bukti foto START untuk jadwal ini (maksimal 1 kali per projek).');
            }
        }

        if ($type === 'END') {
            if (! $existingStartProof) {
                return redirect()->route('photographer.schedules.show', $schedule->id)
                    ->with('error', 'Anda harus mengambil foto bukti START terlebih dahulu sebelum menyelesaikan pemotretan.');
            }

            if ($existingEndProof) {
                return redirect()->route('photographer.schedules.show', $schedule->id)
                    ->with('error', 'Anda sudah pernah mengirimkan bukti foto SELESAI (END) untuk jadwal ini (maksimal 1 kali per projek).');
            }
        }

        // Haversine distance calculation in meters
        $distance = GeoUtils::calculateHaversineDistance(
            (float) $schedule->latitude,
            (float) $schedule->longitude,
            (float) $validated['latitude'],
            (float) $validated['longitude']
        );

        // Store photo securely
        $path = $request->file('photo')->store('proofs', 'public');

        $status = $type === 'START' ? 'START_PENDING' : 'END_PENDING';

        $proof = PhotoSessionProof::create([
            'schedule_id' => $schedule->id,
            'project_id' => $schedule->project ? $schedule->project->id : null,
            'photographer_id' => $photographerId,
            'type' => $type,
            'photo_path' => $path,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'accuracy' => $validated['accuracy'],
            'distance_from_location' => $distance,
            'captured_at' => Carbon::now(),
            'status' => $status,
        ]);

        if ($type === 'START') {
            $schedule->update(['status' => 'SHOOTING']);
            if ($schedule->project) {
                $schedule->project->update(['status' => 'SHOOTING']);
            }
        } elseif ($type === 'END') {
            $schedule->update(['status' => 'COMPLETED']);
            if ($schedule->project) {
                $schedule->project->update(['status' => 'EDITING']);
            }
        }

        ActivityLogger::log('SUBMITTED', 'PROOF', "Photographer mengirim foto bukti {$type} (Jarak: {$distance}m dari lokasi).", $proof->id);

        return redirect()->route('photographer.schedules.show', $schedule->id)
            ->with('success', "Bukti foto {$type} pemotretan berhasil dikirim. Menunggu validasi Admin.");
    }
}
