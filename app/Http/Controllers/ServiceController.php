<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(
            DB::table('services')->get()
        );
    }

    public function store(Request $request)
{
    $service = DB::table('services')
        ->where('id', $request->service_id)
        ->first();

    $newStart = strtotime($request->appointment_date);
    $newEnd = $newStart + ($service->duration * 60);

    $appointments = DB::table('appointments')
        ->join('services', 'appointments.service_id', '=', 'services.id')
        ->where('appointments.staff_id', $request->staff_id)
        ->select(
            'appointments.appointment_date',
            'services.duration'
        )
        ->get();

    foreach ($appointments as $appointment) {
        $existingStart = strtotime($appointment->appointment_date);
        $existingEnd = $existingStart + ($appointment->duration * 60);

        $isOverlap =
            $newStart < $existingEnd &&
            $newEnd > $existingStart;

        if ($isOverlap) {
            return response()->json([
                'message' => 'Staff is busy during this time'
            ], 400);
        }
    }

    $id = DB::table('appointments')->insertGetId([
        'customer_id' => $request->customer_id,
        'staff_id' => $request->staff_id,
        'service_id' => $request->service_id,
        'appointment_date' => $request->appointment_date,
        'status' => $request->status ?? 'Pending',
    ]);

    return response()->json([
        'message' => 'Appointment added',
        'id' => $id,
    ]);
}
}