<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoriasResource;
use App\Models\Categorias;
use App\Services\ImageCompressionService;
use Illuminate\Http\Request;

class CategoriasController extends Controller
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
        return CategoriasResource::collection(
            Categorias::orderBy('categoria')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->except('imagen');

        $compressedImage = $this->imageCompressionService->compressImage($request->imagen, 'app/uploads_categorias/');
        $data['imagen'] = $compressedImage;

        $categoria = Categorias::create($data);

        return new CategoriasResource($categoria);
    }

    /**
     * Display the specified resource.
     */
    public function show(Categorias $categoria)
    {
        return new CategoriasResource($categoria);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Categorias $categoria)
    {
        try {
            $data = $request->except('imagen');

            if (isset($request->imagen) ) {
                \Storage::disk('uploads_categorias')->delete($categoria->imagen);

                $compressedImage = $this->imageCompressionService->compressImage($request->imagen, 'app/uploads_categorias/');
                $data['imagen'] = $compressedImage;
            }

            $categoria->update($data);

            return new CategoriasResource($categoria);
        } catch (\Exception $ex) {
            return response()->json([$ex->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categorias $categoria)
    {
        \Storage::disk('uploads_categorias')->delete($categoria->imagen);

        $categoria->delete();

        return new CategoriasResource($categoria);
    }
}
