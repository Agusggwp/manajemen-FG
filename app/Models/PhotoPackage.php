<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PhotoPackage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'price',
        'duration_minutes',
        'number_of_photos',
        'number_of_photographers',
        'includes_mua',
        'estimated_photographer_cost',
        'estimated_mua_fee',
        'estimated_operational_cost',
        'description',
        'features',
        'status',
    ];

    protected $casts = [
        'price' => 'float',
        'estimated_photographer_cost' => 'float',
        'estimated_mua_fee' => 'float',
        'estimated_operational_cost' => 'float',
        'includes_mua' => 'boolean',
        'features' => 'array',
    ];

    protected $appends = [
        'estimated_total_cost',
        'estimated_profit',
        'estimated_margin',
    ];

    public function getEstimatedTotalCostAttribute(): float
    {
        return (float) ($this->estimated_photographer_cost + $this->estimated_mua_fee + $this->estimated_operational_cost);
    }

    public function getEstimatedProfitAttribute(): float
    {
        return (float) ($this->price - $this->estimated_total_cost);
    }

    public function getEstimatedMarginAttribute(): float
    {
        if ($this->price <= 0) {
            return 0.0;
        }

        return round(($this->estimated_profit / $this->price) * 100, 2);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
