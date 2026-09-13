<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotographerProjectSalary extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'photographer_id',
        'amount',
        'work_start_time',
        'work_end_time',
        'work_duration_minutes',
        'payment_status',
        'paid_at',
        'payment_method',
        'payment_note',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'float',
        'paid_at' => 'datetime',
        'work_duration_minutes' => 'integer',
    ];

    protected $appends = [
        'formatted_paid_at',
    ];

    public function getFormattedPaidAtAttribute()
    {
        return $this->paid_at ? $this->paid_at->setTimezone('Asia/Makassar')->format('d M Y, H:i') . ' WITA' : '-';
    }

    public static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if ($model->work_start_time && $model->work_end_time) {
                try {
                    $start = Carbon::parse($model->work_start_time);
                    $end = Carbon::parse($model->work_end_time);
                    if ($end->lt($start)) {
                        $end->addDay();
                    }
                    $model->work_duration_minutes = $start->diffInMinutes($end);
                } catch (\Exception $e) {
                    // Ignore parse error
                }
            }
        });
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function photographer()
    {
        return $this->belongsTo(User::class, 'photographer_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
