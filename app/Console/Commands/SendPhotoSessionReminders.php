<?php

namespace App\Console\Commands;

use App\Mail\CustomerPhotoSessionReminderMail;
use App\Mail\MuaPhotoSessionReminderMail;
use App\Mail\PhotographerPhotoSessionReminderMail;
use App\Models\Schedule;
use App\Services\ActivityLogger;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendPhotoSessionReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminders:send-photo-session {--date= : Tanggal target (YYYY-MM-DD), default: besok} {--force : Kirim ulang meskipun sudah pernah dikirim}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mengirim email peringatan H-1 jadwal pemotretan ke Pelanggan, Fotografer, dan MUA';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $targetDate = $this->option('date') 
            ? Carbon::parse($this->option('date'))->toDateString()
            : Carbon::tomorrow()->toDateString();

        $this->info("Memproses pengiriman email pengingat jadwal pemotretan untuk tanggal: {$targetDate}");

        $query = Schedule::whereDate('date', $targetDate)
            ->where('status', '!=', 'CANCELLED')
            ->with(['customer', 'photoPackage', 'project.photographers', 'project.muas']);

        if (! $this->option('force')) {
            $query->whereNull('reminder_sent_at');
        }

        $schedules = $query->get();

        if ($schedules->isEmpty()) {
            $this->info("Tidak ada jadwal pemotretan untuk tanggal {$targetDate} yang memerlukan email pengingat.");
            return Command::SUCCESS;
        }

        $countSent = 0;

        foreach ($schedules as $schedule) {
            $customerSent = false;
            $photographersCount = 0;
            $muasCount = 0;

            // 1. Kirim Email ke Pelanggan
            if ($schedule->customer && ! empty($schedule->customer->email)) {
                try {
                    Mail::to($schedule->customer->email)->send(new CustomerPhotoSessionReminderMail($schedule));
                    $customerSent = true;
                } catch (\Exception $e) {
                    Log::error("Gagal mengirim email pengingat ke Pelanggan {$schedule->customer->email}: {$e->getMessage()}");
                    $this->error("Gagal kirim email ke Pelanggan ({$schedule->customer->email}): {$e->getMessage()}");
                }
            }

            // 2. Kirim Email ke Fotografer & MUA via Project
            if ($schedule->project) {
                // Photographers
                foreach ($schedule->project->photographers as $photographer) {
                    if (! empty($photographer->email)) {
                        try {
                            Mail::to($photographer->email)->send(new PhotographerPhotoSessionReminderMail($schedule, $photographer));
                            $photographersCount++;
                        } catch (\Exception $e) {
                            Log::error("Gagal mengirim email pengingat ke Fotografer {$photographer->email}: {$e->getMessage()}");
                            $this->error("Gagal kirim email ke Fotografer ({$photographer->email}): {$e->getMessage()}");
                        }
                    }
                }

                // MUAs
                foreach ($schedule->project->muas as $mua) {
                    if (! empty($mua->email)) {
                        try {
                            Mail::to($mua->email)->send(new MuaPhotoSessionReminderMail($schedule, $mua));
                            $muasCount++;
                        } catch (\Exception $e) {
                            Log::error("Gagal mengirim email pengingat ke MUA {$mua->email}: {$e->getMessage()}");
                            $this->error("Gagal kirim email ke MUA ({$mua->email}): {$e->getMessage()}");
                        }
                    }
                }
            }

            // Update timestamp reminder sent
            $schedule->update([
                'reminder_sent_at' => now(),
            ]);

            $countSent++;

            $logMsg = "Email pengingat H-1 dikirim untuk Jadwal #{$schedule->id} ({$schedule->location_name}). Pelanggan: " . ($customerSent ? 'Ya' : 'Tidak') . ", Fotografer: {$photographersCount}, MUA: {$muasCount}.";
            $this->info($logMsg);

            ActivityLogger::log(
                'EMAIL_REMINDER_SENT',
                'SCHEDULE',
                $logMsg,
                $schedule->id
            );
        }

        $this->info("Selesai! {$countSent} jadwal berhasil diproses.");

        return Command::SUCCESS;
    }
}
