<?php

use App\Http\Controllers\DeviceAccessTokenController;
use App\Http\Controllers\DeviceAuthorizationController;
use Illuminate\Support\Facades\Route;


Route::post('/device-authorize', [DeviceAuthorizationController::class, 'authorize'])->middleware('guest');

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/device-tokens', [DeviceAccessTokenController::class, 'forUser']);

    Route::get('/device-request', [DeviceAccessTokenController::class, 'request']);

    Route::post('/device-tokens', [DeviceAccessTokenController::class, 'store']);

    Route::delete('/device-tokens/{token_id}', [DeviceAccessTokenController::class, 'destroy']);
});
