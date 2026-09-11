<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mua extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'muas';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'profile_photo',
        'specialty',
        'bio',
        'status',
        'notes',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function projectFees()
    {
        return $this->hasMany(MuaProjectFee::class, 'mua_id');
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_muas', 'mua_id', 'project_id');
    }
}
