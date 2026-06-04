<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Services extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
        'duration_minutes',
        'status',
        'note',
        'image_url'
    ];
    public function invoices()
    {
        return $this->belongsToMany(Invoices::class, 'invoice_details', 'invoice_id', 'service_id');
    }
}
