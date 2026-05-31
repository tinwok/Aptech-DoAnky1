import { useState, useEffect } from "react";

import staffsData from "../data/staffs";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import AddStaffDialog from "../components/staff/AddStaffDialog";
import EditStaffDialog from "../components/staff/EditStaffDialog";

export default function StaffList() {
  const [search, setSearch] = useState("");

  const [staffs, setStaffs] = useState(() => {
    const savedStaffs = localStorage.getItem("staffs");
    return savedStaffs ? JSON.parse(savedStaffs) : staffsData;
  });

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    localStorage.setItem("staffs", JSON.stringify(staffs));
  }, [staffs]);

  const handleAdd = (newStaff) => {
    setStaffs([...staffs, newStaff]);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this staff?")) {
      setStaffs(staffs.filter((staff) => staff.id !== id));
    }
  };

  const handleEdit = (updatedStaff) => {
    setStaffs(
      staffs.map((staff) =>
        staff.id === updatedStaff.id ? updatedStaff : staff,
      ),
    );
  };

  const handleCreateAppointment = (staff) => {
    const customer = prompt("Customer name:");

    if (!customer) return;

    const service = prompt("Service name:");

    if (!service) return;

    const date = prompt("Date (YYYY-MM-DD):");

    if (!date) return;

    const time = prompt("Time (HH:mm):");

    if (!time) return;

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push({
      id: Date.now(),
      customer,
      service,
      date,
      time,
      staff: staff.name,
    });

    localStorage.setItem("appointments", JSON.stringify(appointments));

    alert(`Appointment created for ${staff.name}`);

    window.location.reload();
  };

  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.email.toLowerCase().includes(search.toLowerCase()) ||
      staff.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Staff Management</h1>

        <Button onClick={() => setOpenAdd(true)}>Add Staff</Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Appointments</th>
            <th className="p-3 text-left">Action</th>
            <th className="p-3 text-left">Create Appointment</th>
          </tr>
        </thead>

        <tbody>
          {filteredStaffs.map((staff) => {
            const appointmentCount = appointments.filter(
              (a) => a.staff === staff.name,
            ).length;

            return (
              <tr
                key={staff.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{staff.name}</td>

                <td className="p-3">{staff.email}</td>

                <td className="p-3">{staff.phone}</td>

                <td className="p-3">{staff.role}</td>

                <td className="p-3">
                  <span
                    className={
                      staff.status === "Active"
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                        : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                    }
                  >
                    {staff.status}
                  </span>
                </td>

                <td className="p-3 font-bold">{appointmentCount}</td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedStaff(staff);
                        setOpenEdit(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button onClick={() => handleDelete(staff.id)}>
                      Delete
                    </Button>
                  </div>
                </td>

                <td className="p-3">
                  <Button onClick={() => handleCreateAppointment(staff)}>
                    Create
                  </Button>
                </td>
              </tr>
            );
          })}

          {filteredStaffs.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center p-4">
                No staff found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <AddStaffDialog open={openAdd} setOpen={setOpenAdd} onAdd={handleAdd} />

      <EditStaffDialog
        open={openEdit}
        setOpen={setOpenEdit}
        staff={selectedStaff}
        onSave={handleEdit}
      />
    </div>
  );
}
