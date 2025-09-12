<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\UsuariosResource;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UsuariosController extends Controller
{
    /**
     * Display the resources.
     */
    public function index(Request $request)
    {
        return UsuariosResource::collection(
            User::orderBy('email')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $usuario = User::create($request->all());
        $usuario->assignRole($request->role);

        return new UsuariosResource($usuario);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $usuario)
    {
        return new UsuariosResource($usuario);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $usuario)
    {
        try {
            $data = $request->except('password', 'repeated_password');

            if ($request->filled('password')) {
                $data['password'] = \Hash::make($data['password']);
            }

            $usuario->update($data);
            $usuario->assignRole($request->role);
            
            return new UsuariosResource($usuario);
        } catch (\Exception $ex) {
            return $ex->getMessage();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $usuario)
    {
        $usuario->delete();

        return new UsuariosResource($usuario);
    }
}
