<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Invoice_details;
use App\Models\Invoices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Invoices::with('services')->paginate(10);;
        return response()->json($data, 200);
    }

    /**
     * Show the form for creating a new resource.
     */

    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function booking(StoreBookingRequest $request)
    {
        $validated = $request->validated();
        $isBooked = Invoices::where('staff_id', $validated['staff_id'])->where('appointment_date', $validated['appointment_date'])
            ->where(function ($query) use ($validated) {
                $query->where('start_time', '<', $validated['start_time'])->where('end_time', '>', $validated['end_time']);
            })->exists();
        if ($isBooked) {
            return response()->json([
                'message' => 'This staff already booked!'
            ]);
        }


        DB::transaction(function () use ($validated, $request) {
            $validated['status'] = 'pending';
            $appointment = Invoices::create($validated);
            foreach ($request->service_ids as $serviceId) {
                $appointment->invoiceDetail()->create([
                    'service_id' => $serviceId
                ]);
            }
        });
        return response()->json(['message' => 'Booked successfully!'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoices $invoice)
    {
        return response()->json($invoice->load('invoiceDetail'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoices $invoices)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Invoices $invoice)
    {
        $validated = $request->validated();
        $invoice->update($validated);
        $invoice->services()->sync($request->service_id);
        return response()->json(['message' => 'Updated successfully!']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoices $invoice)
    {
        $invoice->delete();
        return response()->json(['message' => 'Deleted successfully!']);
    }
}
