<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Nnjeim\World\Models\City;

class Comercios extends Model
{
    use SoftDeletes;

    protected $table = 'comercios';
    protected $guarded = [];

    protected $fillable = [
        'users_id',
        'ciudades_id',
        'nombre',
        'verificado',
        'tipo_suscripcion',
        'logo',
        'banner',
        'direccion',
        'latitud',
        'longitud',
        'numero',
    ];

    public function ciudad()
    {
        return $this->belongsTo(City::class, 'ciudades_id', 'id');
    }
    
    function sedes () {
        return $this->hasMany(Sedes::class, 'comercios_id');
    }

    function usuario () {
        return $this->hasOne(User::class, 'id', 'users_id');
    }

    public function categorias()
    {
        return $this->belongsToMany(Categorias::class, 'comercios_categorias', 'comercios_id', 'categorias_id');
    }
}
