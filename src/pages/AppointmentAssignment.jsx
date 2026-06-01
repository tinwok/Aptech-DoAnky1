import { useState, useEffect } from "react";

import AssignDialog from "../components/appointment/AssignDialog";
import NewAppointmentDialog from "../components/appointment/NewAppointmentDialog";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { useLoaderData } from "react-router-dom";

export async function loader() {
  const [appointmentsRes, staffsRes] = await Promise.all([
    fetch("http://127.0.0.1:8000/api/appointments"),
    fetch("http://127.0.0.1:8000/api/staffs"),
  ]);

  return {
    appointments: await appointmentsRes.json(),
    staffs: await staffsRes.json(),
  };
}

export async function action({ request }) {
  const formData = await request.formData();

  const intent = formData.get("intent");

  if (intent === "delete") {
    const id = formData.get("id");

    await fetch(`http://127.0.0.1:8000/api/appointments/${id}`, {
      method: "DELETE",
    });
  }

  return null;
}

export default function AppointmentAssignment() {
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [search, setSearch] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const data = useLoaderData();

  const [appointments, setAppointments] = useState(data.appointments);
  const [staffs] = useState(data.staffs);

  const loadAvailableSlots = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/appointments/available-slots",
      );

      const data = await res.json();

      setAvailableSlots(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadAppointments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/appointments");

      const data = await res.json();

      setAppointments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAppointment = async (id) => {
    const confirmDelete = window.confirm("Delete this appointment?");

    if (!confirmDelete) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/appointments/${id}`, {
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
  useEffect(() => {
    const loadData = async () => {
      await loadAvailableSlots();
      await loadAppointments();
    };

    loadData();
  }, []);
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
      <div className="mb-6 border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Available Time Slots</h2>

        <div className="flex flex-wrap gap-2">
          {availableSlots.map((slot) => (
            <span
              key={slot}
              className="px-3 py-1 bg-green-100 text-green-700 rounded"
            >
              {slot}
            </span>
          ))}
        </div>
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
                        : appointment.status === "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : appointment.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
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

                <Button
                  variant="outline"
                  onClick={async () => {
                    const newDate = prompt(
                      "Nhập ngày giờ mới",
                      `${appointment.date} ${appointment.time}`,
                    );

                    if (!newDate) return;

                    try {
                      await fetch(
                        `http://127.0.0.1:8000/api/appointments/${appointment.id}`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            staff_id: 1,
                            appointment_date: newDate,
                            status: appointment.status,
                          }),
                        },
                      );

                      await loadAppointments();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    const newStatus = prompt(
                      "Status (Pending / Confirmed / Completed / Cancelled)",
                      appointment.status,
                    );

                    if (!newStatus) return;

                    try {
                      await fetch(
                        `http://127.0.0.1:8000/api/appointments/${appointment.id}`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            staff_id: 1,
                            appointment_date: `${appointment.date} ${appointment.time}`,
                            status: newStatus,
                          }),
                        },
                      );

                      await loadAppointments();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  Status
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
              `http://127.0.0.1:8000/api/appointments/${selectedAppointment.id}`,
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
