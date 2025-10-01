<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RedesResource;
use App\Models\RedesSociales;
use Illuminate\Http\Request;

class RedesSocialesController extends Controller
{
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
        RedesSociales::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(RedesSociales $rede)
    {
        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $rede,
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
    public function update(Request $request, RedesSociales $rede)
    {
        $rede->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RedesSociales $rede)
    {
        $rede->delete();
    }


    public function bySede(Request $request)
    {
        return RedesResource::collection(
            RedesSociales::where('sedes_id', $request->id)->get()
        );
    }


    public function byComercio(Request $request)
    {
        return RedesResource::collection(
            RedesSociales::where('comercios_id', $request->comercio)->get()
        );
    }
}
