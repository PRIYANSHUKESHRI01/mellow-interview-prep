<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Public self-registration. Always creates a plain student account —
     * staff, TPO, and superadmin accounts are provisioned by administrators
     * (see AdminController) so a caller can never grant themselves elevated
     * access through this endpoint.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'handle' => ['required', 'string', 'max:64', 'alpha_dash', 'unique:users,handle'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'institution' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'handle' => $validated['handle'],
            'password' => Hash::make($validated['password']),
            'role' => User::ROLE_USER,
        ]);

        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'user' => $user->load('college'),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        if ($user->is_blocked) {
            throw ValidationException::withMessages([
                'email' => ['This account has been blocked. Contact an administrator.'],
            ]);
        }

        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'user' => $user->load('college'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('college'),
        ]);
    }
}
