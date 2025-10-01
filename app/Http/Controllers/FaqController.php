<?php

namespace App\Http\Controllers;

use App\Http\Resources\FaqResource;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as Peticion;
use Inertia\Inertia;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = \Auth::user();

        $query = Faq::with('comercio');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('pregunta', 'like', '%'.$request->search.'%')
                ->orWhere('respuesta', 'like', '%'.$request->search.'%')
                ->orWhereHas('comercio', function ($q2) use ($request) {
                    $q2->where('nombre', 'like', '%'.$request->search.'%');
                });
            });
        }

        return Inertia::render('Faq/Index', [
            'filters' => Peticion::all('search', 'trashed'),
            'lista' => FaqResource::collection(
                $query->paginate()->appends($request->all())
            ),
        ]);
    }
}
