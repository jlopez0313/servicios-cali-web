<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ComentariosResource;
use App\Models\Comentarios;
use Illuminate\Http\Request;

class ComentariosController extends Controller
{
    /**
     * Display the resources.
     */
    public function index()
    {
        return ComentariosResource::collection(Comentarios::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $comentario = Comentarios::create([
            'sedes_id' => $request->sedes_id,
            'servicios_id' => $request->servicios_id,
            'clientes_id' => \Auth::user()->id,
            'comentario' => $request->comentario,
            'rating' => $request->rating,
            'aprobado' => false,
        ]);

        return new ComentariosResource($comentario);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $comentario = Comentarios::with('respuesta')->find($id);

        return new ComentariosResource($comentario);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comentarios $comentario)
    {
        $comentario->update($request->except('respuesta'));

        $comentario->respuesta()->updateOrCreate(
            [
                'comentarios_id' => $comentario->id,
            ],
            [
                'respuesta' => $request->respuesta,
            ],
        );

        return new ComentariosResource($comentario);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comentarios $comentario)
    {
        $comentario->delete();

        return new ComentariosResource($comentario);
    }
}
