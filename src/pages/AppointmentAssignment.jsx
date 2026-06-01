import { useState, useEffect } from "react";

import AssignDialog from "../components/appointment/AssignDialog";
import NewAppointmentDialog from "../components/appointment/NewAppointmentDialog";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function AppointmentAssignment() {
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [search, setSearch] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [staffs, setStaffs] = useState([]);

  const loadAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments");

      const data = await res.json();

      setAppointments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadStaffs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/staffs");

      const data = await res.json();

      setStaffs(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadAppointments();
      await loadStaffs();
    };

    fetchData();
  }, []);

  const handleDeleteAppointment = async (id) => {
    const confirmDelete = window.confirm("Delete this appointment?");

    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
      });

      await loadAppointments();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.customer?.toLowerCase().includes(search.toLowerCase()) ||
      appointment.staff?.toLowerCase().includes(search.toLowerCase()) ||
      appointment.service?.toLowerCase().includes(search.toLowerCase()),
  );

  const activeStaffCount = staffs.filter(
    (staff) => staff.status === "Active",
  ).length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointment Assignment</h1>

        <Button onClick={() => setOpenNew(true)}>New Appointment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <p className="text-gray-500">Total Appointments</p>

          <p className="text-3xl font-bold">{appointments.length}</p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-gray-500">Assigned</p>

          <p className="text-3xl font-bold">
            {
              appointments.filter((a) => a.staff && a.staff !== "Unassigned")
                .length
            }
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-gray-500">Staff Available</p>

          <p className="text-3xl font-bold">{activeStaffCount}</p>
        </div>
      </div>

      <div className="mb-6">
        <Input
          className="shadow-sm"
          placeholder="Search customer, staff or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3 text-left">Customer</th>

            <th className="p-3 text-left">Staff</th>

            <th className="p-3 text-left">Service</th>

            <th className="p-3 text-left">Date</th>

            <th className="p-3 text-left">Time</th>

            <th className="p-3 text-left">Status</th>

            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredAppointments.map((appointment) => (
            <tr key={appointment.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{appointment.customer}</td>

              <td className="p-3">{appointment.staff || "Unassigned"}</td>

              <td className="p-3">{appointment.service}</td>

              <td className="p-3">
                {appointment.date
                  ? new Date(appointment.date).toLocaleDateString("vi-VN")
                  : "-"}
              </td>

              <td className="p-3">
                {appointment.time ? appointment.time.slice(0, 5) : "-"}
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    appointment.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : appointment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {appointment.status}
                </span>
              </td>

              <td className="p-3 flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                >
                  Delete
                </Button>

                <Button
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setOpen(true);
                  }}
                >
                  Assign
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AssignDialog
        open={open}
        setOpen={setOpen}
        appointment={selectedAppointment}
        staffs={staffs}
        onAssign={async (staffId) => {
          try {
            await fetch(
              `http://localhost:5000/api/appointments/${selectedAppointment.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  staff_id: Number(staffId),
                }),
              },
            );

            await loadAppointments();
          } catch (error) {
            console.error(error);
          }
        }}
      />

      <NewAppointmentDialog
        open={openNew}
        setOpen={setOpenNew}
        onAdd={() => loadAppointments()}
      />
    </div>
  );
}
