import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

export default function EditServiceDialog({ open, setOpen, service, onSave }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const handleOpen = () => {
    if (service) {
      setName(service.name);
      setPrice(service.price);
      setDuration(service.duration);
    }
  };

  const handleSave = () => {
    onSave({
      ...service,
      name,
      price: Number(price),
      duration,
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
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Service Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <Input
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
