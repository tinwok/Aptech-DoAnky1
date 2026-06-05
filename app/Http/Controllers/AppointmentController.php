<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Appointment;
use App\Models\Service;
class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = DB::select("
            SELECT
                a.id,
                c.name AS customer,
                s.name AS staff,
                sv.name AS service,
                DATE(a.appointment_date) AS date,
                TIME(a.appointment_date) AS time,
                a.status
            FROM appointments a
            LEFT JOIN customers c ON a.customer_id = c.id
            LEFT JOIN staffs s ON a.staff_id = s.id
            LEFT JOIN services sv ON a.service_id = sv.id
        ");

        return response()->json($appointments);
    }
 public function store(Request $request)
{
    $service = Service::find($request->service_id);

    if (!$service) {
        return response()->json([
            'message' => 'Service not found'
        ], 404);
    }

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

        $existingEnd =
            $existingStart +
            ($appointment->duration * 60);

        if (
            $newStart < $existingEnd &&
            $newEnd > $existingStart
        ) {
            return response()->json([
                'message' => 'This staff already has an appointment during this time'
            ], 400);
        }
    }

    $appointment = Appointment::create([
        'customer_id' => $request->customer_id,
        'staff_id' => $request->staff_id,
        'service_id' => $request->service_id,
        'appointment_date' => $request->appointment_date,
        'status' => $request->status ?? 'Pending',
    ]);

    return response()->json([
        'message' => 'Appointment added',
        'id' => $appointment->id,
    ]);
}

public function update(Request $request, $id)
{
    $appointment = Appointment::find($id);

    if (!$appointment) {
        return response()->json([
            'message' => 'Appointment not found'
        ], 404);
    }

    $appointment->update([
        'staff_id' => $request->staff_id ?? $appointment->staff_id,
        'appointment_date' => $request->appointment_date ?? $appointment->appointment_date,
        'status' => $request->status ?? $appointment->status,
    ]);

    return response()->json([
        'message' => 'Appointment updated',
    ]);
}

public function destroy($id)
{
    Appointment::destroy($id);

    return response()->json([
        'message' => 'Appointment deleted',
    ]);
}

public function availableSlots()
{
    $slots = [];

    $start = strtotime("08:00");
    $end = strtotime("20:00");

    $appointments = DB::table('appointments')
        ->select('appointment_date')
        ->get();

    while ($start < $end) {
        $time = date("H:i", $start);

        $busy = false;

        foreach ($appointments as $appointment) {
            $appointmentTime = date(
                "H:i",
                strtotime($appointment->appointment_date)
            );

            if ($appointmentTime === $time) {
                $busy = true;
                break;
            }
        }

        if (!$busy) {
            $slots[] = $time;
        }

        $start += 30 * 60;
    }

    return response()->json($slots);
}
public function availableSlotsByService($serviceId)
{
    $service = DB::table('services')
        ->where('id', $serviceId)
        ->first();

    $duration = $service->duration;

    $slots = [];

    $start = strtotime("08:00");
    $end = strtotime("20:00");

    while ($start < $end) {

        $slotStart = $start;
        $slotEnd = $slotStart + ($duration * 60);

        $busy = false;

        $appointments = DB::table('appointments')
            ->join(
                'services',
                'appointments.service_id',
                '=',
                'services.id'
            )
            ->select(
                'appointments.appointment_date',
                'services.duration'
            )
            ->get();

        foreach ($appointments as $appointment) {

            $appointmentStart =
                strtotime($appointment->appointment_date);

            $appointmentEnd =
                $appointmentStart +
                ($appointment->duration * 60);

            if (
                $slotStart < $appointmentEnd &&
                $slotEnd > $appointmentStart
            ) {
                $busy = true;
                break;
            }
        }

        if (!$busy) {
            $slots[] = date("H:i", $slotStart);
        }

        $start += 30 * 60;
    }

    return response()->json([
        'service' => $service->name,
        'duration' => $duration,
        'slots' => $slots
    ]);
}

}