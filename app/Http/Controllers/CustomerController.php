<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function index()
    {
        return response()->json(DB::table('customers')->get());
    }

    public function store(Request $request)
    {
        $id = DB::table('customers')->insertGetId([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'gender' => $request->gender,
            'status' => 'Active',
        ]);

        return response()->json([
            'message' => 'Customer added',
            'id' => $id,
        ]);
    }

    public function update(Request $request, $id)
    {
        DB::table('customers')
            ->where('id', $id)
            ->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'gender' => $request->gender,
                'status' => $request->status,
            ]);

        return response()->json([
            'message' => 'Customer updated',
        ]);
    }

    public function destroy($id)
    {
        DB::table('customers')
            ->where('id', $id)
            ->delete();

        return response()->json([
            'message' => 'Customer deleted',
        ]);
    }
}