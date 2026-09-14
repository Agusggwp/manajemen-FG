<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Schedule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'booking_id',
        'customer_id',
        'photo_package_id',
        'date',
        'start_time',
        'end_time',
        'overtime_hours',
        'overtime_fee',
        'location_name',
        'location_address',
        'latitude',
        'longitude',
        'location_radius',
        'location_notes',
        'mua_location_name',
        'mua_location_address',
        'mua_latitude',
        'mua_longitude',
        'mua_location_radius',
        'mua_location_notes',
        'mua_same_as_shooting_location',
        'notes',
        'status',
        'reminder_sent_at',
    ];

    protected $casts = [
        'date' => 'date',
        'overtime_hours' => 'integer',
        'overtime_fee' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
        'location_radius' => 'integer',
        'mua_latitude' => 'float',
        'mua_longitude' => 'float',
        'mua_location_radius' => 'integer',
        'mua_same_as_shooting_location' => 'boolean',
        'reminder_sent_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_reminder_sent_at',
    ];

    public function getFormattedReminderSentAtAttribute()
    {
        return $this->reminder_sent_at ? $this->reminder_sent_at->setTimezone('Asia/Makassar')->format('d M Y, H:i') . ' WITA' : null;
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function photoPackage()
    {
        return $this->belongsTo(PhotoPackage::class);
    }

    public function project()
    {
        return $this->hasOne(Project::class);
    }

    public function proofs()
    {
        return $this->hasMany(PhotoSessionProof::class);
    }
}
