<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Kirim email peringatan H-1 jadwal pemotretan setiap hari sesuai jam yang diatur oleh Admin di System Settings
Schedule::command('reminders:send-photo-session')->everyMinute()->when(function () {
    $targetTime = \App\Models\SystemSetting::where('key', 'reminder_email_time')->value('value') ?: '08:00';
    return \Carbon\Carbon::now()->format('H:i') === substr($targetTime, 0, 5);
});


