<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public const ROLE_USER = 'user';

    public const ROLE_ADMIN_INTERNAL = 'admin_internal';

    public const ROLE_ADMIN_TPO = 'admin_tpo';

    public const ROLE_SUPERADMIN = 'superadmin';

    public const ROLES = [
        self::ROLE_USER,
        self::ROLE_ADMIN_INTERNAL,
        self::ROLE_ADMIN_TPO,
        self::ROLE_SUPERADMIN,
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'handle',
        'college_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_blocked' => 'boolean',
            'blocked_at' => 'datetime',
        ];
    }

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function blockedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'blocked_by');
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPERADMIN;
    }

    public function isMellowStaff(): bool
    {
        return $this->role === self::ROLE_ADMIN_INTERNAL;
    }

    public function isCollegeTpo(): bool
    {
        return $this->role === self::ROLE_ADMIN_TPO;
    }

    public function isStudent(): bool
    {
        return $this->role === self::ROLE_USER;
    }

    /**
     * Mellow staff and superadmins operate the platform internally and may
     * supervise/manage every college's TPO portal.
     */
    public function canManageColleges(): bool
    {
        return $this->isMellowStaff() || $this->isSuperAdmin();
    }
}
