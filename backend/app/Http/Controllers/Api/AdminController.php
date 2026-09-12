<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Mellow-internal-staff-only operations (role: admin_internal, superadmin).
 * A college_tpo account is blocked from every route here by the
 * role:admin_internal,superadmin middleware applied in routes/api.php —
 * that is what makes "TPOs can't see the Mellow dashboard" a server-enforced
 * fact rather than a UI convention.
 */
class AdminController extends Controller
{
    /**
     * List every partner college together with its TPO account(s), for the
     * Mellow "Partner Universities" governance screen.
     */
    public function colleges()
    {
        $colleges = College::withCount(['users as active_students_count' => function ($query) {
            $query->where('role', User::ROLE_USER);
        }])
            ->with(['users' => function ($query) {
                $query->where('role', User::ROLE_ADMIN_TPO);
            }])
            ->latest()
            ->get();

        return response()->json(['colleges' => $colleges]);
    }

    /**
     * Onboard a new partner college and provision its TPO account in one step.
     */
    public function storeCollege(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'short_code' => ['nullable', 'string', 'max:20', 'unique:colleges,short_code'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'tier' => ['required', Rule::in(['Academic Enterprise', 'Pro Campus', 'Standard'])],
            'tpo_name' => ['required', 'string', 'max:255'],
            'tpo_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
        ]);

        [$college, $tpo, $temporaryPassword] = DB::transaction(function () use ($validated) {
            $college = College::create([
                'name' => $validated['name'],
                'short_code' => $validated['short_code'] ?? Str::upper(Str::substr(Str::slug($validated['name'], ''), 0, 6)),
                'city' => $validated['city'] ?? null,
                'state' => $validated['state'] ?? null,
                'tier' => $validated['tier'],
            ]);

            $temporaryPassword = Str::password(16);

            $tpo = User::create([
                'name' => $validated['tpo_name'],
                'email' => $validated['tpo_email'],
                'handle' => Str::slug($validated['tpo_name']).'-'.Str::lower(Str::random(4)),
                'password' => Hash::make($temporaryPassword),
                'role' => User::ROLE_ADMIN_TPO,
                'college_id' => $college->id,
            ]);

            return [$college, $tpo, $temporaryPassword];
        });

        return response()->json([
            'college' => $college,
            'tpo' => $tpo,
            'temporary_password' => $temporaryPassword,
        ], 201);
    }

    /**
     * List TPO (and other) accounts scoped to a specific college.
     */
    public function collegeTpos(College $college)
    {
        return response()->json([
            'college' => $college,
            'tpos' => $college->tpoAdmins()->get(),
        ]);
    }

    /**
     * Block or unblock a TPO account. Mellow staff manage TPOs; TPOs cannot
     * touch this endpoint (blocked by the role middleware) nor each other's
     * accounts (not exposed to them at all).
     */
    public function toggleTpoBlock(Request $request, User $user)
    {
        $result = $this->toggleBlock($request, $user, [User::ROLE_ADMIN_TPO], 'This endpoint only manages college TPO accounts.');

        return $result instanceof User ? response()->json(['tpo' => $result->fresh('college')]) : $result;
    }

    /**
     * List student/coder ("user" role) accounts, for the Mellow "Platform
     * Users" management screen — separate from TPO accounts, which are
     * managed only via the colleges endpoints above.
     */
    public function users(Request $request)
    {
        $query = User::where('role', User::ROLE_USER);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('handle', 'like', "%{$search}%");
            });
        }

        return response()->json(['users' => $query->latest()->get()]);
    }

    /**
     * Create a new student/coder account on a user's behalf (e.g. onboarding
     * someone without requiring them to self-register first).
     */
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'handle' => ['required', 'string', 'max:64', 'alpha_dash', 'unique:users,handle'],
        ]);

        $temporaryPassword = Str::password(16);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'handle' => $validated['handle'],
            'password' => Hash::make($temporaryPassword),
            'role' => User::ROLE_USER,
        ]);

        return response()->json([
            'user' => $user,
            'temporary_password' => $temporaryPassword,
        ], 201);
    }

    /**
     * Block or unblock a student/coder account.
     */
    public function toggleUserBlock(Request $request, User $user)
    {
        $result = $this->toggleBlock($request, $user, [User::ROLE_USER], 'This endpoint only manages student/coder accounts.');

        return $result instanceof User ? response()->json(['user' => $result->fresh()]) : $result;
    }

    /**
     * Shared block/unblock logic, scoped to an allow-list of roles so Mellow
     * staff can only ever moderate TPOs and students — never other staff or
     * superadmin accounts.
     */
    private function toggleBlock(Request $request, User $user, array $allowedRoles, string $errorMessage)
    {
        if (! in_array($user->role, $allowedRoles, true)) {
            return response()->json(['message' => $errorMessage], 422);
        }

        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $user->is_blocked = ! $user->is_blocked;
        $user->blocked_at = $user->is_blocked ? now() : null;
        $user->blocked_reason = $user->is_blocked ? ($validated['reason'] ?? null) : null;
        $user->blocked_by = $user->is_blocked ? $request->user()->id : null;
        $user->save();

        return $user;
    }
}
