<?php

use Illuminate\Support\Facades\Route;

Route::prefix('web')
->group(function () {
    Route::prefix('categorias')
    ->controller(App\Http\Controllers\Api\CategoriasController::class)
    ->group(function () {
        Route::get('/', 'index')->name('categorias.public');
    });
});
