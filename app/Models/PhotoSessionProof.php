<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotoSessionProof extends Model
{
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'project_id',
        'photographer_id',
        'type',
        'photo_path',
        'latitude',
        'longitude',
        'accuracy',
        'distance_from_location',
        'captured_at',
        'status',
        'admin_id',
        'admin_note',
        'validated_at',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'accuracy' => 'float',
        'distance_from_location' => 'float',
        'captured_at' => 'datetime',
        'validated_at' => 'datetime',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function photographer()
    {
        return $this->belongsTo(User::class, 'photographer_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
