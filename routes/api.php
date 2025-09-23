<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['web', 'verified'])
->prefix('web')
->group(function () {
    Route::apiResource('categorias', App\Http\Controllers\Api\CategoriasController::class);
    Route::apiResource('comentarios', App\Http\Controllers\Api\ComentariosController::class);
    Route::apiResource('horarios', App\Http\Controllers\Api\HorariosController::class);

    Route::apiResource('servicios', App\Http\Controllers\Api\ServiciosController::class);
    Route::apiResource('redes', App\Http\Controllers\Api\RedesSocialesController::class);
    Route::apiResource('usuarios', App\Http\Controllers\Api\UsuariosController::class);

    Route::controller(App\Http\Controllers\Api\SedesController::class)
    ->prefix('sedes')
    ->group(function () {
        Route::post('/clone/{sede}', 'clone')->name('sedes.clone');
    });

    Route::apiResource('sedes', App\Http\Controllers\Api\SedesController::class);

    Route::controller(App\Http\Controllers\Api\SubcategoriasController::class)
    ->prefix('subcategorias')
    ->group(function () {
        Route::get('/categoria/{categoria}', 'byCategoria')->name('subcategorias.categoria');
    });

    Route::apiResource('subcategorias', App\Http\Controllers\Api\SubcategoriasController::class);
});
