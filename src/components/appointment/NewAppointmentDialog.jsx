import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export default function NewAppointmentDialog({ open, setOpen, onAdd }) {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

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
      const res = await fetch("http://127.0.0.1:8000/api/appointments", {
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

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

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
            onChange={async (e) => {
              setServiceId(e.target.value);

              try {
                const res = await fetch(
                  `http://127.0.0.1:8000/api/appointments/available-slots/${e.target.value}`,
                );

                const data = await res.json();

                setAvailableSlots(data.slots);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <option value="">Select Service</option>

            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.duration} mins)
              </option>
            ))}
          </select>

          {serviceId && (
            <p className="text-sm text-gray-500">
              Duration:{" "}
              {services.find((s) => s.id === Number(serviceId))?.duration} mins
            </p>
          )}

          {availableSlots.length > 0 && (
            <div>
              <p className="text-sm font-medium">Available Slots</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {availableSlots.map((slot) => (
                  <span
                    key={slot}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          )}

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
