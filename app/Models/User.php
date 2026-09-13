<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'profile_photo',
        'specialty',
        'bio',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Send password reset notification using custom notification.
     */
    public function sendPasswordResetNotification($token): void
    {
        $url = route('password.reset', [
            'token' => $token,
            'email' => $this->getEmailForPasswordReset(),
        ]);

        $this->notify(new \App\Notifications\ResetPasswordNotification($url));
    }

    public function scopePhotographer($query)
    {
        return $query->where('role', 'PHOTOGRAPHER');
    }

    public function scopeAdmin($query)
    {
        return $query->where('role', 'ADMIN');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function projectSalaries()
    {
        return $this->hasMany(PhotographerProjectSalary::class, 'photographer_id');
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_photographers', 'photographer_id', 'project_id');
    }

    public function proofs()
    {
        return $this->hasMany(PhotoSessionProof::class, 'photographer_id');
    }
}
