<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Franjas;
use App\Models\Horarios;
use App\Models\Sedes;
use Illuminate\Http\Request;

class HorariosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $horarios = Horarios::all();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $horarios,
        ]);
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
        \DB::transaction(function () use ($request) {
            $sede = Sedes::find($request->sede);

            $horariosIds = $sede->horarios()->pluck('id');
            Franjas::whereIn('horarios_id', $horariosIds)->delete();
            Horarios::where('sedes_id', $sede->id)->delete();

            foreach ($request->dias as $dia) {
                $horario = $sede->horarios()->create([
                    'dia' => $dia['dia'],
                    'abierto' => $dia['abierto'],
                ]);

                if ($dia['abierto']) {
                    foreach ($dia['franjas'] as $franja) {
                        $horario->franjas()->create([
                            'hora_inicio' => $franja['hora_inicio'],
                            'hora_fin' => $franja['hora_fin'],
                        ]);
                    }
                }
            }
        });

        return response()->json([], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $sede = Sedes::with('horarios.franjas')->find($request->id);

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $sede->horarios,
        ]);
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
    public function update(Request $request, Horarios $horario)
    {
        $horario->update($request->all());
        
        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $horario,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Horarios $horario)
    {
        $horario->delete();
    }
}
