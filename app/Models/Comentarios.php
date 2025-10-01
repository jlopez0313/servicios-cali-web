<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comentarios extends Model
{
    // use SoftDeletes;

    protected $table = 'comentarios';
    protected $guarded = [];

    protected $casts = [
        'created_at' => 'date',
    ];

    public function respuesta()
    {
        return $this->hasOne(Respuestas::class, 'comentarios_id', 'id');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicios::class, 'servicios_id', 'id');
    }

    public function sede()
    {
        return $this->belongsTo(Sedes::class, 'sedes_id', 'id');
    }

    public function cliente()
    {
        return $this->belongsTo(User::class, 'clientes_id', 'id');
    }
}
