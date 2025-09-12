<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware(['web', 'verified'])
->prefix('web')
->group(function () {
    Route::apiResource('usuarios', App\Http\Controllers\Api\UsuariosController::class);
    Route::apiResource('categorias', App\Http\Controllers\Api\UsuariosController::class);
});