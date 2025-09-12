<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubcategoriasResource;
use App\Models\Categorias;
use App\Models\Subcategorias;
use App\Services\ImageCompressionService;
use Illuminate\Http\Request;

class SubcategoriasController extends Controller
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
        return SubcategoriasResource::collection(
            Subcategorias::orderBy('subcategoria')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->except('imagen', 'categorias_id');
        $data['usuarios_id'] = \Auth::id();

        $compressedImage = $this->imageCompressionService->compressImage($request->imagen, 'app/uploads_subcategorias/');
        $data['imagen'] = $compressedImage;

        $subcategoria = Subcategorias::create($data);

        return new SubcategoriasResource($subcategoria);
    }

    /**
     * Display the specified resource.
     */
    public function show(Subcategorias $subcategoria)
    {
        return new SubcategoriasResource($subcategoria);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subcategorias $subcategoria)
    {
        try {
            $data = $request->except('imagen', 'categorias_id');
            $data['usuarios_id'] = \Auth::id();

            if (isset($request->imagen)) {
                \Storage::disk('uploads_subcategorias')->delete($subcategoria->imagen);

                $compressedImage = $this->imageCompressionService->compressImage($request->imagen, 'app/uploads_subcategorias/');
                $data['imagen'] = $compressedImage;
            }

            $subcategoria->update($data);

            return new SubcategoriasResource($subcategoria);
        } catch (\Exception $ex) {
            return $ex->getMessage();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subcategorias $subcategoria)
    {
        \Storage::disk('uploads_subcategorias')->delete($subcategoria->imagen);

        $subcategoria->delete();

        return new SubcategoriasResource($subcategoria);
    }

    public function byCategoria(Request $request, Categorias $categoria)
    {
        return SubcategoriasResource::collection(
            Subcategorias::orderBy('subcategoria')
                ->where('categorias_id', $categoria->id)
                ->where('usuarios_id', \Auth::id())
                ->get()
        );
    }
}
