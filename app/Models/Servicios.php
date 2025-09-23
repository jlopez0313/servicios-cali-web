<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servicios extends Model
{
    protected $table = 'servicios';

    protected $fillable = [
        'subcategorias_id',
        'servicio',
        'url',
        'whatsapp',
        'descripcion',
        'imagen',
        'precio',
    ];

    public function subcategoria() {
        return $this->belongsTo(Subcategorias::class, 'subcategorias_id', 'id');
    }
}
