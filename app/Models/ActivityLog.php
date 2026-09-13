<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'module',
        'record_id',
        'description',
        'ip_address',
    ];

    protected $appends = [
        'formatted_created_at',
        'formatted_time',
        'formatted_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFormattedCreatedAtAttribute()
    {
        if (! $this->created_at) {
            return '-';
        }

        return $this->created_at->setTimezone('Asia/Makassar')->format('d M Y, H:i') . ' WITA';
    }

    public function getFormattedTimeAttribute()
    {
        if (! $this->created_at) {
            return '-';
        }

        return $this->created_at->setTimezone('Asia/Makassar')->format('H:i:s') . ' WITA';
    }

    public function getFormattedDateAttribute()
    {
        if (! $this->created_at) {
            return '-';
        }

        return $this->created_at->setTimezone('Asia/Makassar')->format('d M Y');
    }
}
