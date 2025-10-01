<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComerciosResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
        if (is_null($this->resource)) {
            return [];
        }

        return [
            'id' => $this->id,
            'ciudad' => $this->ciudad,
            'nombre' => $this->nombre,
            'categorias' => $this->categorias,
            'verificado' => $this->verificado,
            'tipo_suscripcion' => $this->tipo_suscripcion,
            'logo' => $this->logo,
            'banner' => $this->banner,
            'direccion' => $this->direccion,
            'latitud' => $this->latitud,
            'longitud' => $this->longitud,
            'numero' => $this->numero,
        ];
    }
}
