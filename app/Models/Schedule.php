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
        'location_name',
        'location_address',
        'latitude',
        'longitude',
        'location_radius',
        'location_notes',
        'notes',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'latitude' => 'float',
        'longitude' => 'float',
        'location_radius' => 'integer',
    ];

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
