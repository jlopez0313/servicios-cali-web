<?php

namespace App\Http\Controllers;

use App\Http\Resources\SedesResource;
use App\Models\Sedes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as Peticion;
use Inertia\Inertia;

class SedesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Sedes::with('ciudad.state.country', 'comercio')
            ->forCurrentUser();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('sede', 'like', '%'.$request->input('search').'%')
                ->orWhereHas('ciudad', function ($q2) use ($request) {
                    $q2->where(function ($q3) use ($request) {
                        $q3->where('name', 'like', '%'.$request->search.'%')
                        ->orWhereHas('state', function ($q4) use ($request) {
                            $q4->where('name', 'like', '%'.$request->search.'%')
                            ->orWhereHas('country', function ($q5) use ($request) {
                                $q5->where('name', 'like', '%'.$request->search.'%');
                            });
                        });
                    });
                })
                ->orWhereHas('comercio', function ($q2) use ($request) {
                    $q2->where('nombre', 'like', '%'.$request->search.'%');
                });
            });
        }

        return Inertia::render('Sedes/Index', [
            'filters' => Peticion::all('search', 'trashed'),
            'lista' => SedesResource::collection(
                $query->paginate()->appends($request->all())
            ),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Sedes/Form/Tabs', []);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('Sedes/Form/Tabs', [
            'id' => $id,
        ]);
    }
}
