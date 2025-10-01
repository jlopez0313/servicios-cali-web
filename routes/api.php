<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('constants', function () {
    return config('constants');
})->name('constants');

Route::middleware(['web', 'verified'])
->prefix('web')
->group(function () {
    Route::apiResource('categorias', App\Http\Controllers\Api\CategoriasController::class);
    Route::apiResource('comentarios', App\Http\Controllers\Api\ComentariosController::class);
    Route::apiResource('horarios', App\Http\Controllers\Api\HorariosController::class);
    Route::apiResource('secciones', App\Http\Controllers\Api\SeccionesController::class);
    Route::apiResource('servicios', App\Http\Controllers\Api\ServiciosController::class);
    Route::apiResource('usuarios', App\Http\Controllers\Api\UsuariosController::class);
    Route::apiResource('comercios', App\Http\Controllers\Api\ComerciosController::class);
    Route::apiResource('faq', App\Http\Controllers\Api\FaqController::class);

    Route::prefix('sedes')
    ->controller(App\Http\Controllers\Api\SedesController::class)
    ->group(function () {
        Route::post('/clone/{sede}', 'clone')->name('sedes.clone');
    });
    Route::apiResource('sedes', App\Http\Controllers\Api\SedesController::class);

    Route::prefix('redes')
    ->controller(App\Http\Controllers\Api\RedesSocialesController::class)
    ->group(function () {
        Route::get('/sede', 'bySede')->name('redes.sede');
        Route::get('/comercio', 'byComercio')->name('redes.comercio');
    });
    Route::apiResource('redes', App\Http\Controllers\Api\RedesSocialesController::class);
});

require __DIR__.'/api_guest.php';
