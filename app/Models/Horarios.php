<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Horarios extends Model
{
    // use SoftDeletes;

    protected $table = 'horarios';
    protected $guarded = [];

    function franjas () {
        return $this->hasMany(Franjas::class, 'horarios_id');
    }
}
