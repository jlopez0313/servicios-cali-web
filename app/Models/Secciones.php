<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Secciones extends Model
{
    protected $table = 'secciones';

    protected $fillable = [
        'usuarios_id',
        'seccion',
        'imagen',
    ];

    public function usuario() {
        return $this->belongsTo(User::class, 'usuarios_id', 'id');
    }
}
