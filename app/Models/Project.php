<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_code',
        'project_name',
        'booking_id',
        'schedule_id',
        'customer_id',
        'photo_package_id',
        'package_name',
        'package_price',
        'package_duration',
        'package_includes_mua',
        'overtime_hours',
        'overtime_fee',
        'date',
        'location_name',
        'location_address',
        'latitude',
        'longitude',
        'location_radius',
        'mua_location_name',
        'mua_location_address',
        'mua_latitude',
        'mua_longitude',
        'mua_location_radius',
        'mua_location_notes',
        'mua_same_as_shooting_location',
        'status',
        'notes',
        'deadline',
        'work_start_time',
        'work_end_time',
        'work_duration_minutes',
    ];

    protected $casts = [
        'package_price' => 'float',
        'package_includes_mua' => 'boolean',
        'overtime_hours' => 'integer',
        'overtime_fee' => 'float',
        'date' => 'date',
        'deadline' => 'date',
        'latitude' => 'float',
        'longitude' => 'float',
        'location_radius' => 'integer',
        'mua_latitude' => 'float',
        'mua_longitude' => 'float',
        'mua_location_radius' => 'integer',
        'mua_same_as_shooting_location' => 'boolean',
        'work_duration_minutes' => 'integer',
    ];

    protected $appends = [
        'actual_photographer_cost',
        'actual_mua_cost',
        'actual_operational_cost',
        'actual_total_cost',
        'actual_profit',
        'actual_margin',
        'formatted_work_duration',
    ];

    public static function boot()
    {
        parent::boot();

        static::saving(function ($project) {
            if ($project->work_start_time && $project->work_end_time) {
                try {
                    $start = Carbon::parse($project->work_start_time);
                    $end = Carbon::parse($project->work_end_time);
                    if ($end->lt($start)) {
                        $end->addDay();
                    }
                    $project->work_duration_minutes = $start->diffInMinutes($end);
                } catch (\Exception $e) {
                    // Ignore parse error
                }
            }
        });
    }

    public function getActualPhotographerCostAttribute(): float
    {
        if ($this->relationLoaded('photographerSalaries')) {
            return (float) $this->photographerSalaries->sum('amount');
        }
        return (float) $this->photographerSalaries()->sum('amount');
    }

    public function getActualMuaCostAttribute(): float
    {
        if ($this->relationLoaded('muaFees')) {
            return (float) $this->muaFees->sum('amount');
        }
        return (float) $this->muaFees()->sum('amount');
    }

    public function getActualOperationalCostAttribute(): float
    {
        if ($this->relationLoaded('expenses')) {
            return (float) $this->expenses->sum('amount');
        }
        return (float) $this->expenses()->sum('amount');
    }

    public function getActualTotalCostAttribute(): float
    {
        return (float) ($this->actual_photographer_cost +
            $this->actual_mua_cost +
            $this->actual_operational_cost);
    }

    public function getTotalRevenueAttribute(): float
    {
        $overtimeTotal = (float) ($this->overtime_fee ?: 0);
        return (float) ($this->package_price + $overtimeTotal);
    }

    public function getActualProfitAttribute(): float
    {
        return (float) ($this->total_revenue - $this->actual_total_cost);
    }

    public function getActualMarginAttribute(): float
    {
        $revenue = $this->total_revenue;
        if ($revenue <= 0) {
            return 0.0;
        }

        return round(($this->actual_profit / $revenue) * 100, 2);
    }

    public function getFormattedWorkDurationAttribute(): string
    {
        $minutes = $this->work_duration_minutes;
        if (! $minutes) {
            return '-';
        }

        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;

        if ($hours > 0 && $remainingMinutes > 0) {
            return "{$hours} Jam {$remainingMinutes} Menit";
        } elseif ($hours > 0) {
            return "{$hours} Jam";
        } else {
            return "{$remainingMinutes} Menit";
        }
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function photoPackage()
    {
        return $this->belongsTo(PhotoPackage::class);
    }

    public function photographers()
    {
        return $this->belongsToMany(User::class, 'project_photographers', 'project_id', 'photographer_id');
    }

    public function muas()
    {
        return $this->belongsToMany(Mua::class, 'project_muas', 'project_id', 'mua_id');
    }

    public function photographerSalaries()
    {
        return $this->hasMany(PhotographerProjectSalary::class);
    }

    public function muaFees()
    {
        return $this->hasMany(MuaProjectFee::class);
    }

    public function expenses()
    {
        return $this->hasMany(ProjectExpense::class);
    }

    public function proofs()
    {
        return $this->hasMany(PhotoSessionProof::class);
    }

    public function galleries()
    {
        return $this->hasMany(ProjectGallery::class);
    }
}
