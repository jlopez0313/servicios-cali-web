<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ComerciosResource;
use App\Models\Comercios;
use App\Services\ImageCompressionService;
use Illuminate\Http\Request;

class ComerciosController extends Controller
{
    protected $imageCompressionService;

    public function __construct(ImageCompressionService $imageCompressionService)
    {
        $this->imageCompressionService = $imageCompressionService;
    }

    /**
     * Display the resources.
     */
    public function index()
    {
        return ComerciosResource::collection(
            Comercios::orderBy('nombre')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->except([
            'paises_id',
            'departamentos_id',
            'logo',
            'banner',
            'categorias'
        ]);

        if ($request->logo) {
            $compressedLogo = $this->imageCompressionService->compressImage($request->logo, 'app/uploads_comercios/');
            $data['logo'] = $compressedLogo;
        }

        if ($request->banner) {
            $compressedBanner = $this->imageCompressionService->compressImage($request->banner, 'app/uploads_comercios/');
            $data['banner'] = $compressedBanner;
        }

        $data['users_id'] = \Auth::user()->id;
        $data['tipo_suscripcion'] = 'F';

        $comercio = Comercios::create($data);
        $comercio->categorias()->sync($request->categorias ?? []);

        return new ComerciosResource($comercio);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comercios $comercio)
    {
        $comercio->load('ciudad.state.country', 'usuario', 'categorias');
        return new ComerciosResource($comercio);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comercios $comercio)
    {
        $data = $request->except([
            'paises_id',
            'departamentos_id',
            'logo',
            'banner',
            'categorias'
        ]);

        if (isset($request->logo) && $request->logo != $comercio->logo) {
            
            if ($comercio->logo) {
                \Storage::disk('uploads_comercios')->delete($comercio->logo);
            }

            $compressedLogo = $this->imageCompressionService->compressImage($request->logo, 'app/uploads_comercios/');
            $data['logo'] = $compressedLogo;
        }

        if (isset($request->banner) && $request->banner != $comercio->banner) {
            
            if ($comercio->banner) {
                \Storage::disk('uploads_comercios')->delete($comercio->banner);
            }

            $compressedBanner = $this->imageCompressionService->compressImage($request->banner, 'app/uploads_comercios/');
            $data['banner'] = $compressedBanner;
        }

        $comercio->update($data);
        $comercio->categorias()->sync($request->categorias ?? []);

        return new ComerciosResource($comercio);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comercios $comercio)
    {
        if ($comercio->logo) {
            \Storage::disk('uploads_comercios')->delete($servicio->logo);
        }

        if ($comercio->banner) {
            \Storage::disk('uploads_comercios')->delete($servicio->banner);
        }

        $comercio->delete();
        return new ComerciosResource($comercio);
    }
}
