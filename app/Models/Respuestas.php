<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Respuestas extends Model
{
    // use SoftDeletes;

    protected $table = 'respuestas';
    protected $guarded = [];

    public function comentario()
    {
        return $this->belongsTo(Comentarios::class, 'comentarios_id', 'id');
    }
}
