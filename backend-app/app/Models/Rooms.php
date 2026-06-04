<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rooms extends Model
{
    protected $fillable = ['service_id', 'name', 'description'];
    public function services()
    {
        return $this->belongsTo(Services::class, 'service_id');
    }
}
