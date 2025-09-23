<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comercios;
use App\Models\Comentarios;

class ComentariosController extends Controller
{
    /**
    * NOA\Get(
    *     path="/comentarios",
    *     summary="Lista de comentarios",
    *     tags={"Comentarios"},
    *     security={{"bearerAuth":{}}},
    *     NOA\Response(
    *         response=200,
    *         description="OK"
    *     )
    * )
    */
    public function index()
    {
        $comentarios = Comentarios::all();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $comentarios,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
    * @OA\Post(
    *   path="/comentarios",
    *   summary="Crear un comentario o calificacion para un comercio o un producto",
    *   tags={"Comentarios"},
    *   @OA\RequestBody(
    *       required=true,
    *       request="request",
    *       @OA\JsonContent(
    *           required={"nombre", "fecha", "rating"},
    *           @OA\Property(property="comercios_id", type="number", example="1", nullable=true),
    *           @OA\Property(property="productos_id", type="number", example="1", nullable=true),
    *           @OA\Property(property="nombre", type="string", example="Nombre de la Persona"),
    *           @OA\Property(property="comentario", type="string", example="Texto del comentario"),
    *           @OA\Property(property="fecha", type="string", example="2025-03-14T15:00:00Z"),
    *           @OA\Property(property="rating", type="number", example="2")
    *       )
    *   ),
    *   @OA\Response(
    *     response=200,
    *     description="OK"
    *   )
    * )
    */
    public function store(Request $request)
    {
        $comentario = Comentarios::create([
            'comercios_id' => $request->comercios_id,
            'productos_id' => $request->productos_id,
            'nombre' => $request->nombre,
            'comentario' => $request->comentario,
            'fecha' => $request->fecha,
            'rating' => $request->rating,
            'aprobado' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $comentario,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $comentario = Comentarios::with('respuesta')->find($id);

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $comentario,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comentarios $comentario)
    {
        $comentario->update( $request->except('respuesta') );

        $comentario->respuesta()->updateOrCreate(
            [
                'comentarios_id' => $comentario->id
            ],
            [
                'respuesta' => $request->respuesta
            ],
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comentarios $comentario)
    {
        $comentario->delete();
    }
}
