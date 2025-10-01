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
        'comercios_id',
        'ciudades_id',
        'sede',
        'direccion',
        'latitud',
        'longitud',
        'numero',
        'estado',
    ];

    protected $appends = ['estrellas', 'rating', 'estado_label'];

    public function comercio()
    {
        return $this->belongsTo(Comercios::class, 'comercios_id', 'id');
    }
    
    public function ciudad()
    {
        return $this->belongsTo(City::class, 'ciudades_id', 'id');
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
        $promedio = optional($this->comentarios())->avg('rating') ?? 0;

        return $promedio ? (int) round((float) $promedio) : 0;
    }

    public function getRatingAttribute()
    {
        $promedio = optional($this->productos)->avg('rating') ?? 0;

        return $promedio ? (int) round($promedio) : 0;
    }

    public function scopeForCurrentUser($query)
    {
        if (\Auth::user()->hasRole('proveedor')) {
            return $query->where('comercios_id', \Auth::user()->comercio->id);
        }

        return $query;
    }

    public function getEstadoLabelAttribute()
    {
        $estados = config('constants.estados');
        $estado = collect($estados)->first(fn($item) => $item['key'] == $this->estado);

        return $estado['valor'] ?? 'A';
    }
}
