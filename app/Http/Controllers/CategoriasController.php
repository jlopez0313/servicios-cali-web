<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoriasResource;
use App\Models\Categorias;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as Peticion;
use Inertia\Inertia;

class CategoriasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Categorias::orderBy('categoria');

        if ($request->filled('search')) {
            $query->where('categoria', 'like', '%'.$request->search.'%');
        }

        return Inertia::render('Categorias/Index', [
            'filters' => Peticion::all('search', 'trashed'),
            'lista' => CategoriasResource::collection(
                $query->paginate(1)->appends($request->all())
            ),
        ]);
    }
}
