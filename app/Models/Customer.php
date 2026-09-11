<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'notes',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
