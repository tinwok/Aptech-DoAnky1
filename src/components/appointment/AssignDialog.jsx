import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export default function AssignDialog({
  open,
  setOpen,
  appointment,
  staffs,
  onAssign,
}) {
  const [selectedStaff, setSelectedStaff] = useState("");

  const handleSave = async () => {
    if (!selectedStaff || !appointment) return;

    try {
      await onAssign(selectedStaff);

      setSelectedStaff("");
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const activeStaffs = staffs.filter((staff) => staff.status === "Active");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Staff</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            <strong>Customer:</strong> {appointment?.customer}
          </p>

          <p>
            <strong>Service:</strong> {appointment?.service}
          </p>

          <select
            className="w-full border rounded-md p-2"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
          >
            <option value="">Select Staff</option>

            {activeStaffs.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>

          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
