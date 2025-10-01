<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servicios extends Model
{
    protected $table = 'servicios';

    protected $fillable = [
        'sedes_id',
        'categorias_id',
        'secciones_id',
        'servicio',
        'url',
        'whatsapp',
        'descripcion',
        'imagen',
        'es_virtual',
        'precio',
        'a_domicilio',
        'en_sede',
        'precio_domicilio',
    ];

    public function secciones() {
        return $this->belongsToMany(Secciones::class, 'servicios_secciones', 'servicios_id', 'secciones_id');
    }

    public function sede()
    {
        return $this->belongsTo(Sedes::class, 'sedes_id', 'id');
    }
}
