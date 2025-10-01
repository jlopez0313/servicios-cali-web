<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiciosResource;
use App\Models\Servicios;
use App\Services\ImageCompressionService;
use Illuminate\Http\Request;

class ServiciosController extends Controller
{
    protected $imageCompressionService;

    public function __construct(ImageCompressionService $imageCompressionService)
    {
        $this->imageCompressionService = $imageCompressionService;
    }

    /**
     * Display the resources.
     */
    public function index(Request $request)
    {
        return ServiciosResource::collection(
            Servicios::orderBy('servicio')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $data = $request->except('imagen', 'secciones_id');
    
            $compressedImage = $this->imageCompressionService->compressImage($request->imagen, 'app/uploads_servicios/');
            $data['imagen'] = $compressedImage;
    
            $data['en_sede'] = $request->boolean('en_sede') == true ? 1 : 0;
            $data['a_domicilio'] = $request->boolean('a_domicilio') == true ? 1 : 0;

            $servicio = Servicios::create($data);
            $servicio->secciones()->sync($request->secciones_id ?? []);
    
            return new ServiciosResource($servicio);
        } catch (\Exception $ex) {
            return response()->json([$ex->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Servicios $servicio)
    {
        $servicio->load('secciones', 'sede.comercio', 'sede.ciudad.state.country');
        return new ServiciosResource($servicio);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Servicios $servicio)
    {
        try {
            $data = $request->except('imagen', 'secciones_id');

            if (isset($request->imagen) ) {
                
                if ($seccion->imagen) {
                    \Storage::disk('uploads_servicios')->delete($servicio->imagen);
                }

                $compressedImage = $this->imageCompressionService->compressImage($request->imagen, 'app/uploads_servicios/');
                $data['imagen'] = $compressedImage;
            }

            $data['es_virtual'] = $request->boolean('es_virtual') == true ? 1 : 0;
            $data['en_sede'] = $request->boolean('en_sede') == true ? 1 : 0;
            $data['a_domicilio'] = $request->boolean('a_domicilio') == true ? 1 : 0;

            $servicio->update($data);
            $servicio->secciones()->sync($request->secciones_id ?? []);

            return new ServiciosResource($servicio);
        } catch (\Exception $ex) {
            return response()->json([$ex->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Servicios $servicio)
    {
        if ($seccion->imagen) {
            \Storage::disk('uploads_servicios')->delete($servicio->imagen);
        }

        $servicio->delete();

        return new ServiciosResource($servicio);
    }
}
