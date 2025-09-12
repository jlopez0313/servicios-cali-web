<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiciosResource extends JsonResource
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
            'subcategoria' => $this->subcategoria,
            'servicio' => $this->servicio,
            'descripcion' => $this->descripcion,
            'url' => $this->url,
            'imagen' => $this->imagen,
        ];
    }
}
