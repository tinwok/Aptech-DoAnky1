import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

export default function AddStaffDialog({ open, setOpen, onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    onAdd({
      id: Date.now(),
      name,
      email,
      phone,
      role: "Stylist",
      status: "Active",
    });

    setName("");
    setEmail("");
    setPhone("");

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Staff</DialogTitle>
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
