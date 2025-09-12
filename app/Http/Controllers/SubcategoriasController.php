<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubcategoriasResource;
use App\Models\Subcategorias;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as Peticion;
use Inertia\Inertia;

class SubcategoriasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Subcategorias::with('categoria')
            ->where('usuarios_id', \Auth::id())
            ->orderBy('subcategoria');

        if ($request->filled('search')) {
            $query->where(function($q) use ($request){
                $q->where('subcategoria', 'like', '%'.$request->search.'%')
                    ->orWhereHas('categoria', function ($q2) use ($request) {
                        $q2->where('categoria', 'like', '%'.$request->search.'%');
                    });
            });
        }

        return Inertia::render('Subcategorias/Index', [
            'filters' => Peticion::all('search', 'trashed'),
            'lista' => SubcategoriasResource::collection(
                $query->paginate()->appends($request->all())
            ),
        ]);
    }
}
