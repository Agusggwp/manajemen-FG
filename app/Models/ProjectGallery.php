<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'photographer_id',
        'file_path',
        'file_name',
        'file_size',
        'title',
        'description',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function photographer()
    {
        return $this->belongsTo(User::class, 'photographer_id');
    }
}
