<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::middleware(['role:admin,cliente'])
    ->group(
        function () {
            Route::prefix('usuarios')
            ->group(function () {
                Route::get('/', [App\Http\Controllers\UsuariosController::class, 'index'])
                    ->name('usuarios');
            });

            Route::prefix('categorias')
            ->group(function () {
                Route::get('/', [App\Http\Controllers\CategoriasController::class, 'index'])
                    ->name('categorias');
            });

            Route::prefix('subcategorias')
            ->group(function () {
                Route::get('/', [App\Http\Controllers\SubcategoriasController::class, 'index'])
                    ->name('subcategorias');
            });

            Route::prefix('servicios')
            ->group(function () {
                Route::get('/', [App\Http\Controllers\ServiciosController::class, 'index'])
                    ->name('servicios');
            });
        }
    );
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
