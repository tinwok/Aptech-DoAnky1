import { useState, useEffect } from "react";

import AssignDialog from "../components/appointment/AssignDialog";
import NewAppointmentDialog from "../components/appointment/NewAppointmentDialog";

import initialAppointments from "../data/appointments";
import staffsData from "../data/staffs";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function AppointmentAssignment() {
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [search, setSearch] = useState("");

  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem("appointments");

    return savedAppointments
      ? JSON.parse(savedAppointments)
      : initialAppointments;
  });

  const staffs = JSON.parse(localStorage.getItem("staffs")) || staffsData;

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const handleAssign = (staffName) => {
    setAppointments(
      appointments.map((item) =>
        item.id === selectedAppointment.id
          ? { ...item, staff: staffName }
          : item,
      ),
    );
  };

  const handleAddAppointment = (newAppointment) => {
    setAppointments([...appointments, newAppointment]);
  };

  const handleEditCustomer = (appointment) => {
    const newCustomer = prompt(
      "Enter new customer name:",
      appointment.customer,
    );

    if (!newCustomer) return;

    setAppointments(
      appointments.map((item) =>
        item.id === appointment.id
          ? {
              ...item,
              customer: newCustomer,
            }
          : item,
      ),
    );
  };

  const handleDeleteAppointment = (id) => {
    const confirmDelete = window.confirm("Delete this appointment?");

    if (!confirmDelete) return;

    setAppointments(appointments.filter((item) => item.id !== id));
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.customer.toLowerCase().includes(search.toLowerCase()) ||
      appointment.staff.toLowerCase().includes(search.toLowerCase()) ||
      appointment.service.toLowerCase().includes(search.toLowerCase()),
  );

  const activeStaffCount = staffs.filter(
    (staff) => staff.status === "Active",
  ).length;

  return (
    <div className="p-8">
      {" "}
      <div className="flex justify-between items-center mb-6">
        {" "}
        <h1 className="text-3xl font-bold">Appointment Assignment </h1>
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

            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredAppointments.map((appointment) => (
            <tr
              key={appointment.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-3 font-medium">{appointment.customer}</td>

              <td className="p-3">{appointment.staff}</td>

              <td className="p-3">{appointment.service}</td>

              <td className="p-3">{appointment.date}</td>

              <td className="p-3">{appointment.time}</td>

              <td className="p-3 flex gap-2">
                <Button onClick={() => handleEditCustomer(appointment)}>
                  Edit
                </Button>

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

          {filteredAppointments.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <AssignDialog
        open={open}
        setOpen={setOpen}
        appointment={selectedAppointment}
        staffs={staffs}
        onAssign={handleAssign}
      />
      <NewAppointmentDialog
        open={openNew}
        setOpen={setOpenNew}
        onAdd={handleAddAppointment}
      />
    </div>
  );
}
