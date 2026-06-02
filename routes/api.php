<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\StaffsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;




Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
// cần phải đăng nhập và gửi gửi request kèm token mới sử dụng được route này
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/me/profile', [AuthController::class, 'updateProfile']);
    //  /me/profile sửa thêm trong cùng 1 route chỉ cần gọi post
    Route::post('/me/logout', [AuthController::class, 'logout']);
    Route::delete('me/delete', [AuthController::class, 'destroy']);
});

// Can phai la admin
Route::middleware(['auth', 'role:admin'])->prefix('dashboard/admin')->group(function () {
    //staff
    Route::apiResource('staffs', StaffsController::class)
        ->except(['index', 'show']);
    // User
    Route::apiResource('customers', CustomersController::class)
        ->except(['index', 'show']);
    Route::apiResource('users', UserController::class);
    Route::patch('users/{id}/restore', [UserController::class, 'restore']);
});
