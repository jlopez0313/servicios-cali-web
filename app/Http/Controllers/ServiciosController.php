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
    public function index(Request $request)
    {
        $query = Servicios::with('subcategoria.categoria')
            ->orderBy('servicio');

        if ($request->filled('search')) {
            $query->where(function($q) use ($request){
                $q->where('servicio', 'like', '%'.$request->search.'%')
                    ->orWhere('whastapp', 'like', '%'.$request->search.'%')
                    ->orWhere('precio', 'like', '%'.$request->search.'%')
                    ->orWhereHas('subcategoria', function ($q2) use ($request) {
                        $q2->where(function($q3) use ($request){
                            $q3->where('subcategoria', 'like', '%'.$request->search.'%')
                                ->orWhereHas('categoria', function ($q4) use ($request) {
                                    $q4->where('categoria', 'like', '%'.$request->search.'%');
                                });
                        });
                    });
            });
        }

        return Inertia::render('Servicios/Index', [
            'filters' => Peticion::all('search', 'trashed'),
            'lista' => ServiciosResource::collection(
                $query->paginate()->appends($request->all())
            ),
        ]);
    }
}
