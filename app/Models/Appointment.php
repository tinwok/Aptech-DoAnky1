<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $table = 'appointments';

    protected $fillable = [
        'customer_id',
        'staff_id',
        'service_id',
        'appointment_date',
        'status'
    ];
}