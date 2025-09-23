<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comentarios extends Model
{
    // use SoftDeletes;

    protected $table = 'comentarios';
    protected $guarded = [];

    public function respuesta()
    {
        return $this->hasOne(Respuestas::class, 'comentarios_id', 'id');
    }

    public function producto()
    {
        return $this->belongsTo(Productos::class, 'productos_id', 'id');
    }

    public function sede()
    {
        return $this->belongsTo(sedes::class, 'sedes_id', 'id');
    }
}
