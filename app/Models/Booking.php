<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'booking_code',
        'customer_id',
        'photo_package_id',
        'booking_date',
        'status',
        'notes',
        'package_name',
        'package_price',
        'package_duration',
        'package_includes_mua',
        'overtime_hours',
        'overtime_fee',
    ];

    protected $casts = [
        'package_price' => 'float',
        'package_includes_mua' => 'boolean',
        'overtime_hours' => 'integer',
        'overtime_fee' => 'float',
        'booking_date' => 'date',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function photoPackage()
    {
        return $this->belongsTo(PhotoPackage::class);
    }

    public function schedule()
    {
        return $this->hasOne(Schedule::class);
    }

    public function project()
    {
        return $this->hasOne(Project::class);
    }
}
