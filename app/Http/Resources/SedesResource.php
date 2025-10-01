<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SedesResource extends JsonResource
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
            'comercio' => $this->comercio,
            'ciudad' => $this->ciudad,
            'sede' => $this->sede,
            'direccion' => $this->direccion,
            'latitud' => $this->latitud,
            'longitud' => $this->longitud,
            'estrellas' => $this->estrellas,
            'rating_precios' => $this->rating_precios,
            'numero' => $this->numero,
            'estado' => $this->estado,
            'estado_label' => $this->estado_label,
        ];
    }
}
