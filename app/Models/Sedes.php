<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Nnjeim\World\Models\City;

class Sedes extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'sedes';
    protected $guarded = [];

    protected $fillable = [
        'ciudades_id',
        'sede',
        'direccion',
        'latitud',
        'longitud',
        'numero',
    ];

    protected $appends = ['estrellas', 'rating'];

    public function ciudad()
    {
        return $this->belongsTo(City::class, 'ciudades_id', 'id');
    }

    public function categorias()
    {
        return $this->belongsToMany(Categorias::class, 'sedes_categorias', 'sedes_id', 'categorias_id');
    }

    public function comentarios()
    {
        return $this->hasMany(Comentarios::class, 'sedes_id');
    }

    public function horarios()
    {
        return $this->hasMany(Horarios::class, 'sedes_id');
    }

    public function redes_sociales()
    {
        return $this->hasMany(RedesSociales::class, 'sedes_id');
    }

    public function getEstrellasAttribute()
    {
        $promedio = $this->comentarios()->avg('rating');

        return $promedio ? (int) round((float) $promedio) : 0;
    }

    public function getRatingAttribute()
    {
        $promedio = $this->productos->avg('rating');

        return $promedio ? (int) round($promedio) : 0;
    }

    public function scopeForCurrentUser($query)
    {
        if (\Auth::user()->hasRole('comercio')) {
            return $query->where('users_id', \Auth::user()->id);
        }

        return $query;
    }
}
