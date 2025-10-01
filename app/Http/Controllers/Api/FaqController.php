<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use App\Services\ImageCompressionService;
use Illuminate\Http\Request;

class FaqController extends Controller
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
        return FaqResource::collection(
            Faq::orderBy('nombre')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $faq = Faq::create($data);

        return new FaqResource($faq);
    }

    /**
     * Display the specified resource.
     */
    public function show(Faq $faq)
    {
        $faq->load('comercio');
        return new FaqResource($faq);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Faq $faq)
    {
        $data = $request->all();
        $faq->update($data);
        
        return new FaqResource($faq);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        $faq->delete();
        return new FaqResource($faq);
    }
}
