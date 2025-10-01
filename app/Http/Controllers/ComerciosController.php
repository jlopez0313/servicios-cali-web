<?php

namespace App\Http\Controllers;

use App\Http\Resources\ComerciosResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Comercios;
use App\Models\Localidades;
use Illuminate\Support\Facades\Request as Peticion;

class ComerciosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Comercios::with('ciudad.state.country', 'usuario');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nombre', 'like', '%'.$request->input('search').'%')
                ->orWhereHas('ciudad', function ($q2) use ($request) {
                    $q2->where(function ($q3) use ($request) {
                        $q3->where('name', 'like', '%'.$request->search.'%')
                        ->orWhereHas('state', function ($q4) use ($request) {
                            $q4->where('name', 'like', '%'.$request->search.'%')
                            ->orWhereHas('country', function ($q5) use ($request) {
                                $q5->where('name', 'like', '%'.$request->search.'%');
                            });
                        });
                    });
                });
            });
        }
        
        return Inertia::render('Comercios/Index', [
            'filters' => Peticion::all('search', 'trashed'),
            'lista' => ComerciosResource::collection(
                $query->paginate()->appends($request->all()),
            ),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Comercios/Form/Tabs', []);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('Comercios/Form/Tabs', [
            'id' => $id,
        ]);
    }

    
    public function usuario(Request $request, string $id)
    {
        $query = Comercios::with('usuario')
        ->where('usuarios_id', $id);
        
        return Inertia::render('Comercios/Index', [
            'filters' => Peticion::all('search', 'trashed'),
            'lista' => ComerciosResource::collection(
                $query->paginate()->appends($request->all()),
            ),
            'userId' => $id
        ]);
    }
}
