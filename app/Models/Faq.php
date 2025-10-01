<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faq extends Model
{
    // use SoftDeletes;

    protected $table = 'faq';
    protected $guarded = [];

    public function comercio()
    {
        return $this->belongsTo(Comercios::class, 'comercios_id', 'id');
    }

}
