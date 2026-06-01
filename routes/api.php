<?php

use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API Working'
    ]);
});

Route::post('/login', [App\Http\Controllers\LoginController::class, 'login']);

Route::get('/staffs', [App\Http\Controllers\StaffController::class, 'index']);
Route::post('/staffs', [App\Http\Controllers\StaffController::class, 'store']);
Route::put('/staffs/{id}', [App\Http\Controllers\StaffController::class, 'update']);
Route::delete('/staffs/{id}', [App\Http\Controllers\StaffController::class, 'destroy']);

Route::get('/customers', [App\Http\Controllers\CustomerController::class, 'index']);
Route::post('/customers', [App\Http\Controllers\CustomerController::class, 'store']);
Route::put('/customers/{id}', [App\Http\Controllers\CustomerController::class, 'update']);
Route::delete('/customers/{id}', [App\Http\Controllers\CustomerController::class, 'destroy']);

Route::get('/services', [App\Http\Controllers\ServiceController::class, 'index']);
Route::post('/services', [App\Http\Controllers\ServiceController::class, 'store']);
Route::put('/services/{id}', [App\Http\Controllers\ServiceController::class, 'update']);
Route::delete('/services/{id}', [App\Http\Controllers\ServiceController::class, 'destroy']);

Route::get('/appointments', [App\Http\Controllers\AppointmentController::class, 'index']);
Route::post('/appointments', [App\Http\Controllers\AppointmentController::class, 'store']);
Route::put('/appointments/{id}', [App\Http\Controllers\AppointmentController::class, 'update']);
Route::delete('/appointments/{id}', [App\Http\Controllers\AppointmentController::class, 'destroy']);
Route::get(
    '/appointments/available-slots',
    [App\Http\Controllers\AppointmentController::class, 'availableSlots']
);
Route::get(
    '/appointments/available-slots/{serviceId}',
    [App\Http\Controllers\AppointmentController::class,
    'availableSlotsByService']
);