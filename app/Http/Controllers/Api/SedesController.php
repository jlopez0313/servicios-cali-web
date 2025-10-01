<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SedesResource;
use App\Models\Sedes;
use Illuminate\Http\Request;

class SedesController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $sede = Sedes::create($request->except('paises_id', 'departamentos_id', 'estrellas', 'rating_precios'));

        return new SedesResource($sede);
    }

    /**
     * Display the specified resource.
     */
    public function show(Sedes $sede)
    {
        $sede->load('ciudad.state.country', 'comercio');

        return new SedesResource($sede);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sedes $sede)
    {
        $sede->update($request->except('paises_id', 'departamentos_id', 'estrellas', 'rating_precios'));

        return new SedesResource($sede);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sedes $sede)
    {
        $sede->delete();
    }

    public function byCiudad($ciudad)
    {
        return SedesResource::collection(
            Sedes::where('ciudades_id', $ciudad)
            ->orderBy('sede')
            ->get()
        );
    }

    public function clone(Sedes $sede)
    {
        \DB::beginTransaction();

        try {
            $sede2 = $sede->replicate(['estrellas', 'rating_precios']);
            $sede2->sede = "{$sede->sede} - Copia";
            $sede2->save();

            foreach ($sede->redes_sociales ?? [] as $red) {
                $newRed = $red->replicate();
                $newRed->sedes_id = $sede2->id;
                $newRed->save();
            }

            foreach ($sede->horarios ?? [] as $horario) {
                $newHorario = $horario->replicate();
                $newHorario->sedes_id = $sede2->id;
                $newHorario->save();

                foreach ($horario->franjas ?? [] as $franja) {
                    $newFranja = $franja->replicate();
                    $newFranja->horarios_id = $newHorario->id;
                    $newFranja->save();
                }
            }

            \DB::commit();

            return new SedesResource($sede2);
        } catch (\Exception $ex) {
            \DB::rollBack();

            return response()->json([
                'sede' => 'Error al guardar',
                'error' => $ex->getMessage(),
            ], 500);
        }
    }
}
