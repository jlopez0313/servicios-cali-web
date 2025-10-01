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

            Route::prefix('comercios')
            ->controller(App\Http\Controllers\ComerciosController::class)
            ->group(function () {
                Route::get('/', 'index')
                    ->name('comercios');
                Route::get('/crear', 'create');
                Route::get('/editar/{sede}', 'edit');
            });

            Route::prefix('secciones')
            ->group(function () {
                Route::get('/', [App\Http\Controllers\SeccionesController::class, 'index'])
                    ->name('secciones');
            });

            Route::prefix('servicios')
            ->group(function () {
                Route::get('/create/{sede}', [App\Http\Controllers\ServiciosController::class, 'create'])
                ->name('servicios.crear');
                Route::get('/{id}', [App\Http\Controllers\ServiciosController::class, 'index'])
                    ->name('servicios');
                Route::get('/{id}/edit/{sede}/', [App\Http\Controllers\ServiciosController::class, 'edit'])
                    ->name('servicios.modificar');
            });

            Route::prefix('comentarios')
            ->controller(App\Http\Controllers\ComentariosController::class)
            ->group(function () {
                Route::get('/sedes/{id}', 'index')->defaults('type', 'sedes')->name('comentarios.sede');
                Route::get('/servicios/{id}', 'index')->defaults('type', 'servicios')->name('comentarios.servicio');
            });

            Route::prefix('faq')
            ->controller(App\Http\Controllers\FaqController::class)
            ->group(function () {
                Route::get('/', 'index')->name('faq');
            });
        }
    );
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/guest.php';
