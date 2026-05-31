import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

export default function EditCustomerDialog({
  open,
  setOpen,
  customer,
  onSave,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleOpen = () => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
    }
  };

  const handleSave = () => {
    onSave({
      ...customer,
      name,
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
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} />

          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />

          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
