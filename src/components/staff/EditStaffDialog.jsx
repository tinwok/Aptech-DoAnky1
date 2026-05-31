import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

export default function EditStaffDialog({ open, setOpen, staff, onSave }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleOpen = () => {
    if (staff) {
      setName(staff.name);
      setEmail(staff.email);
      setPhone(staff.phone);
    }
  };

  const handleSave = () => {
    onSave({
      ...staff,
      name,
      email,
      phone,
    });

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (value) {
          handleOpen();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
