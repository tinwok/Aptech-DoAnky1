<?php

use App\Http\Controllers\CustomersController;
use App\Http\Controllers\StaffsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;






// Can phai la admin
Route::middleware(['auth', 'role:admin'])->prefix('dashboard/admin')->group(function () {
    //staff
    Route::apiResource('staffs', StaffsController::class)
        ->except(['index', 'show']);
    // User
    Route::apiResource('customers', CustomersController::class)
        ->except(['index', 'show']);
    Route::apiResource('users', UserController::class);
});
