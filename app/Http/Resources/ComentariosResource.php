<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComentariosResource extends JsonResource
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
            'servicio' => $this->servicio,
            'cliente' => $this->cliente,
            'comentario' => $this->comentario,
            'respuesta' => $this->respuesta,
            'rating' => $this->rating,
            'aprobado' => $this->aprobado,
            'created_at' => $this->created_at,
        ];
    }
}
