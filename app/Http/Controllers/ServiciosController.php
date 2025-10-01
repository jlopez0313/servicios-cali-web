<?php

namespace App\Http\Controllers;

use App\Http\Resources\ServiciosResource;
use App\Models\Servicios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as Peticion;
use Inertia\Inertia;

class ServiciosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, string $id)
    {
        $query = Servicios::with('secciones', 'sede.comercio')
            ->where('sedes_id', $id)
            ->orderBy('servicio');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('servicio', 'like', '%'.$request->search.'%')
                    ->orWhere('whastapp', 'like', '%'.$request->search.'%')
                    ->orWhere('precio', 'like', '%'.$request->search.'%')
                    ->orWhereHas('secciones', function ($q2) use ($request) {
                        $q2->where('seccion', 'like', '%'.$request->search.'%');
                    });
            });
        }

        return Inertia::render('Servicios/Index', [
            'filters' => Peticion::all('search', 'trashed'),
            'sedesId' => $id,
            'lista' => ServiciosResource::collection(
                $query->paginate()->appends($request->all())
            ),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(string $sede)
    {
        return Inertia::render('Servicios/Form', [
            'sedeId' => $sede,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $sede, string $id)
    {
        return Inertia::render('Servicios/Form', [
            'servicioId' => $id,
            'sedeId' => $sede,
        ]);
    }
}
