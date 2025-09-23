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

    Route::middleware(['role:admin'])
    ->group(
        function () {
            Route::prefix('usuarios')
            ->group(function () {
                Route::get('/', [App\Http\Controllers\UsuariosController::class, 'index'])
                    ->name('usuarios');
            });

            Route::prefix('sedes')
            ->controller(App\Http\Controllers\SedesController::class)
            ->group(function () {
                Route::get('/', 'index');
                Route::get('/crear', 'create');
                Route::get('/editar/{sede}', 'edit');
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

            Route::controller(App\Http\Controllers\ComentariosController::class)
            ->prefix('comentarios')
            ->group(function () {
                Route::get('/sedes/{id}', 'index')->defaults('type', 'sedes')->name('comentarios.sede');
                Route::get('/productos/{id}', 'index')->defaults('type', 'productos')->name('comentarios.producto');
            });
        }
    );
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
