<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice_details extends Model
{
    protected $fillable = ['unit_price', 'discount', 'quantity', 'subtotal'];
    public function invoices()
    {
        return $this->belongsTo(Invoices::class, 'invoice_id');
    }
    public function invoiceDetail()
    {
        return $this->hasMany(Invoice_details::class, 'service_id');
    }
}
