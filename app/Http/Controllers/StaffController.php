<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StaffController extends Controller
{
    public function index()
    {
        return response()->json(
            DB::table('staffs')->get()
        );
    }

    public function store(Request $request)
    {
        $id = DB::table('staffs')->insertGetId([
            'name' => $request->name,
            'position' => $request->position,
            'phone' => $request->phone,
            'email' => $request->email,
            'status' => 'Active',
        ]);

        return response()->json([
            'message' => 'Staff added',
            'id' => $id,
        ]);
    }

    public function update(Request $request, $id)
    {
        DB::table('staffs')
            ->where('id', $id)
            ->update([
                'name' => $request->name,
                'position' => $request->position,
                'phone' => $request->phone,
                'email' => $request->email,
                'status' => $request->status,
            ]);

        return response()->json([
            'message' => 'Staff updated',
        ]);
    }

    public function destroy($id)
    {
        DB::table('staffs')
            ->where('id', $id)
            ->delete();

        return response()->json([
            'message' => 'Staff deleted',
        ]);
    }
}