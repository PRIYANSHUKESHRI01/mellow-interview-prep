<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class College extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'short_code',
        'city',
        'state',
        'tier',
        'placement_rate',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'placement_rate' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function tpoAdmins(): HasMany
    {
        return $this->hasMany(User::class)->where('role', User::ROLE_ADMIN_TPO);
    }
}
