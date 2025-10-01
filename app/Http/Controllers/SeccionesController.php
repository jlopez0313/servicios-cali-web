<?php

namespace App\Http\Controllers;

use App\Http\Resources\SeccionesResource;
use App\Models\Secciones;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as Peticion;
use Inertia\Inertia;

class SeccionesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Secciones::with('usuario')
            ->where('usuarios_id', \Auth::id())
            ->orderBy('seccion');

        if ($request->filled('search')) {
            $query->where('seccion', 'like', '%'.$request->search.'%');
        }

        return Inertia::render('Secciones/Index', [
            'filters' => Peticion::all('search', 'trashed'),
            'lista' => SeccionesResource::collection(
                $query->paginate()->appends($request->all())
            ),
        ]);
    }
}
