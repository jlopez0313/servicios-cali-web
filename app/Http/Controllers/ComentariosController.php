<?php

namespace App\Http\Controllers;

use App\Http\Resources\ComentariosResource;
use App\Models\Comentarios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as Peticion;
use Inertia\Inertia;

class ComentariosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $id, Request $request)
    {
        $user = \Auth::user();

        $query = Comentarios::with('cliente')
            ->where($request->type.'_id', $id)
            ->orderByDesc('created_at');

        if ($request->filled('search')) {
            $query->where('comentario', 'like', '%'.$request->search.'%')
                ->orWhereHas('cliente', function ($q2) use ($request) {
                    $q2->where('name', 'like', '%'.$request->search.'%');
                });
        }

        return Inertia::render('Comentarios/Index', [
            'filters' => Peticion::all('search', 'trashed'),
            'lista' => ComentariosResource::collection(
                $query->paginate()->appends($request->all())
            ),
            'type' => $request->type,
            'sedesId' => $id,
        ]);
    }
}
