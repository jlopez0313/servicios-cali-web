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
            'sede' => $this->sede,
            'secciones' => $this->secciones,
            'servicio' => $this->servicio,
            'descripcion' => $this->descripcion,
            'url' => $this->url,
            'whatsapp' => $this->whatsapp,
            'imagen' => $this->imagen,
            'precio' => $this->precio,
            'es_virtual' => $this->es_virtual,
            'a_domicilio' => $this->a_domicilio,
            'en_sede' => $this->en_sede,
            'precio_domicilio' => $this->precio_domicilio,
        ];
    }
}
