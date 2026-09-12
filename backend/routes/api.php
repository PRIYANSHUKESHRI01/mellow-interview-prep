<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Mellow-internal-staff-only: manage partner colleges and their TPO
    // accounts. A logged-in admin_tpo user gets a 403 from every route in
    // this group, so the Mellow dashboard is unreachable to them server-side.
    Route::middleware('role:'.User::ROLE_ADMIN_INTERNAL.','.User::ROLE_SUPERADMIN)
        ->prefix('admin')
        ->group(function () {
            Route::get('/colleges', [AdminController::class, 'colleges']);
            Route::post('/colleges', [AdminController::class, 'storeCollege']);
            Route::get('/colleges/{college}/tpos', [AdminController::class, 'collegeTpos']);
            Route::post('/tpos/{user}/toggle-block', [AdminController::class, 'toggleTpoBlock']);

            Route::get('/users', [AdminController::class, 'users']);
            Route::post('/users', [AdminController::class, 'storeUser']);
            Route::post('/users/{user}/toggle-block', [AdminController::class, 'toggleUserBlock']);
        });
});
