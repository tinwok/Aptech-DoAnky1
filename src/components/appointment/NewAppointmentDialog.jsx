import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export default function NewAppointmentDialog({ open, setOpen, onAdd }) {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customerRes, serviceRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/customers"),
          fetch("http://127.0.0.1:8000/api/services"),
        ]);

        const customerData = await customerRes.json();

        const serviceData = await serviceRes.json();

        setCustomers(customerData);
        setServices(serviceData);
      } catch (error) {
        console.error(error);
      }
    };

    if (open) {
      loadData();
    }
  }, [open]);

  const handleSave = async () => {
    if (!customerId || !serviceId || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    try {
      await fetch("http://127.0.0.1:8000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: Number(customerId),
          staff_id: 1,
          service_id: Number(serviceId),
          appointment_date: `${date} ${time}:00`,
          status: "Pending",
        }),
      });

      onAdd();

      setCustomerId("");
      setServiceId("");
      setDate("");
      setTime("");

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
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
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          <select
            className="w-full border p-2 rounded"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Select Service</option>

            {services.map((service) => (
              <option key={service.id} value={service.id}>
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
