import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

export default function AddServiceDialog({ open, setOpen, onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const handleSave = () => {
    onAdd({
      id: Date.now(),
      name,
      price: Number(price),
      duration,
    });

    setName("");
    setPrice("");
    setDuration("");

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {" "}
      <DialogContent>
        {" "}
        <DialogHeader>
          {" "}
          <DialogTitle>Add Service</DialogTitle>{" "}
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
