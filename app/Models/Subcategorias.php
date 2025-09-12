<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subcategorias extends Model
{
    protected $table = 'subcategorias';

    protected $fillable = [
        'usuarios_id',
        'subcategorias_id',
        'subcategoria',
        'imagen',
    ];

    public function categoria() {
        return $this->belongsTo(Categorias::class, 'categorias_id', 'id');
    }

    public function usuario() {
        return $this->belongsTo(User::class, 'usuarios_id', 'id');
    }
}
