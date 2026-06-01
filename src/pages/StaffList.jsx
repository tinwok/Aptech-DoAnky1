import { useState, useEffect } from "react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import AddStaffDialog from "../components/staff/AddStaffDialog";
import EditStaffDialog from "../components/staff/EditStaffDialog";

export default function StaffList() {
  const [search, setSearch] = useState("");
  const [staffs, setStaffs] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState(null);

  const loadStaffs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/staffs");
      const data = await res.json();

      setStaffs(
        data.map((staff) => ({
          id: staff.id,
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          role: staff.position,
          status: staff.status,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadStaffs();
    };

    fetchData();
  }, []);

  const handleAdd = async (newStaff) => {
    try {
      await fetch("http://localhost:5000/api/staffs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newStaff.name,
          position: "Stylist",
          phone: newStaff.phone,
          email: newStaff.email,
        }),
      });

      await loadStaffs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff?")) return;

    try {
      await fetch(`http://localhost:5000/api/staffs/${id}`, {
        method: "DELETE",
      });

      await loadStaffs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (updatedStaff) => {
    try {
      await fetch(`http://localhost:5000/api/staffs/${updatedStaff.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updatedStaff.name,
          position: updatedStaff.role,
          phone: updatedStaff.phone,
          email: updatedStaff.email,
          status: updatedStaff.status,
        }),
      });

      await loadStaffs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.email.toLowerCase().includes(search.toLowerCase()) ||
      staff.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8">
      {" "}
      <div className="flex justify-between items-center mb-6">
        {" "}
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
          </tr>
        </thead>

        <tbody>
          {filteredStaffs.map((staff) => {
            const appointmentCount = 0;

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
              </tr>
            );
          })}

          {filteredStaffs.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-4">
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
