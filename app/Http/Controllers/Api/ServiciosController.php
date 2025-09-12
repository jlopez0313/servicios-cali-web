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
        $data = $request->except('imagen');

        $compressedImage = $this->imageCompressionService->compressImage($request->imagen, 'app/uploads_servicios/');
        $data['imagen'] = $compressedImage;

        $servicio = Servicios::create($data);

        return new ServiciosResource($servicio);
    }

    /**
     * Display the specified resource.
     */
    public function show(Servicios $servicio)
    {
        $servicio->load('subcategoria.categoria');
        return new ServiciosResource($servicio);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Servicios $servicio)
    {
        try {
            $data = $request->except('imagen');

            if (isset($request->imagen) ) {
                \Storage::disk('uploads_servicios')->delete($servicio->imagen);

                $compressedImage = $this->imageCompressionService->compressImage($request->imagen, 'app/uploads_servicios/');
                $data['imagen'] = $compressedImage;
            }

            $servicio->update($data);

            return new ServiciosResource($servicio);
        } catch (\Exception $ex) {
            return $ex->getMessage();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Servicios $servicio)
    {
        \Storage::disk('uploads_servicios')->delete($servicio->imagen);

        $servicio->delete();

        return new ServiciosResource($servicio);
    }
}
