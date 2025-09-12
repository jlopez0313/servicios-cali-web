<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Resources\UsuariosResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as Peticion;
use Inertia\Inertia;

class UsuariosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::orderBy('name');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%')
                    ->orWhereHas('roles', function ($q2) use ($request) {
                        $q2->where('name', 'like', '%'.$request->search.'%');
                    });
            });
        }

        return Inertia::render('Usuarios/Index', [
            'filters' => Peticion::all('search', 'trashed'),
            'lista' => UsuariosResource::collection(
                $query->paginate()->appends($request->all())
            ),
            'roles' => UserRole::cases(),
        ]);
    }
}
