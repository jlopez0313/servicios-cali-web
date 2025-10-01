<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RedesSociales extends Model
{
    use SoftDeletes;

    protected $table = 'redes_sociales';
    protected $guarded = [];

    public function sede()
    {
        return $this->belongsTo(Sedes::class, 'sedes_id', 'id');
    }
    
    public function comercio()
    {
        return $this->belongsTo(Comercios::class, 'comercios_id', 'id');
    }
}
