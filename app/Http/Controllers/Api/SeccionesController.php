<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SeccionesResource;
use App\Models\Categorias;
use App\Models\Secciones;
use App\Services\ImageCompressionService;
use Illuminate\Http\Request;

class SeccionesController extends Controller
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
        return SeccionesResource::collection(
            Secciones::orderBy('seccion')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->except('imagen');
        $data['usuarios_id'] = \Auth::id();

        $compressedImage = $this->imageCompressionService->compressImage($request->imagen, 'app/uploads_secciones/');
        $data['imagen'] = $compressedImage;

        $seccione = Secciones::create($data);

        return new SeccionesResource($seccione);
    }

    /**
     * Display the specified resource.
     */
    public function show(Secciones $seccione)
    {
        return new SeccionesResource($seccione);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Secciones $seccione)
    {
        $data = $request->except('imagen');
        $data['usuarios_id'] = \Auth::id();

        if (isset($request->imagen)) {

            if ($seccione->imagen) {
                \Storage::disk('uploads_secciones')->delete($seccione->imagen);
            }

            $compressedImage = $this->imageCompressionService->compressImage($request->imagen, 'app/uploads_secciones/');
            $data['imagen'] = $compressedImage;
        }

        $seccione->update($data);

        return new SeccionesResource($seccione);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Secciones $seccione)
    {
        if ($seccione->imagen) {
            \Storage::disk('uploads_secciones')->delete($seccione->imagen);
        }

        $seccione->delete();

        return new SeccionesResource($seccione);
    }
}
