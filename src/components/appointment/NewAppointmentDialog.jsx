import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

import customersData from "../../data/customers";
import servicesData from "../../data/services";

export default function NewAppointmentDialog({ open, setOpen, onAdd }) {
  const customers =
    JSON.parse(localStorage.getItem("customers")) || customersData;

  const services = JSON.parse(localStorage.getItem("services")) || servicesData;

  const [customer, setCustomer] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSave = () => {
    if (!customer || !service || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    onAdd({
      id: Date.now(),
      customer,
      service,
      date,
      time,
      staff: "Unassigned",
    });

    setCustomer("");
    setService("");
    setDate("");
    setTime("");

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <select
            className="w-full border p-2 rounded"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.name}>
                {customer.name}
              </option>
            ))}
          </select>

          <select
            className="w-full border p-2 rounded"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Select Service</option>

            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            className="w-full border p-2 rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
