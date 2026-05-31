import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import EditServiceDialog from "../components/service/EditServiceDialog";
import AddServiceDialog from "../components/service/AddServiceDialog";

export default function ServiceManagement() {
  const [search, setSearch] = useState("");

  const [services, setServices] = useState(() => {
    const savedServices = localStorage.getItem("services");

    return savedServices
      ? JSON.parse(savedServices)
      : [
          {
            id: 1,
            name: "Hair Cut",
            price: 100000,
            duration: "30 mins",
          },
          {
            id: 2,
            name: "Hair Coloring",
            price: 500000,
            duration: "120 mins",
          },
          {
            id: 3,
            name: "Hair Wash",
            price: 50000,
            duration: "15 mins",
          },
        ];
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  const handleDelete = (id) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const handleEdit = (updatedService) => {
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service,
      ),
    );
  };

  const handleAdd = (newService) => {
    setServices([...services, newService]);
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase()),
  );

  const averagePrice =
    services.length > 0
      ? Math.round(
          services.reduce((sum, service) => sum + service.price, 0) /
            services.length,
        )
      : 0;

  const mostExpensiveService =
    services.length > 0
      ? services.reduce((prev, current) =>
          prev.price > current.price ? prev : current,
        )
      : null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Service Management</h1>

        <Button onClick={() => setOpenAdd(true)}>Add Service</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <p className="text-gray-500">Total Services</p>

          <p className="text-3xl font-bold">{services.length}</p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-gray-500">Average Price</p>

          <p className="text-3xl font-bold">
            {averagePrice.toLocaleString()} VNĐ
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-gray-500">Most Expensive</p>

          <p className="text-xl font-bold">{mostExpensiveService?.name}</p>
        </div>
      </div>

      <div className="mb-6">
        <Input
          className="shadow-sm"
          placeholder="Search service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3 text-left">Name</th>

            <th className="p-3 text-left">Price</th>

            <th className="p-3 text-left">Duration</th>

            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredServices.map((service) => (
            <tr
              key={service.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-3 font-medium">{service.name}</td>

              <td className="p-3 font-medium">
                {service.price.toLocaleString()} VNĐ
              </td>

              <td className="p-3">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {service.duration}
                </span>
              </td>

              <td className="p-3 flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedService(service);
                    setOpenEdit(true);
                  }}
                >
                  Edit
                </Button>

                <Button onClick={() => handleDelete(service.id)}>Delete</Button>
              </td>
            </tr>
          ))}

          {filteredServices.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No services found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <EditServiceDialog
        open={openEdit}
        setOpen={setOpenEdit}
        service={selectedService}
        onSave={handleEdit}
      />

      <AddServiceDialog open={openAdd} setOpen={setOpenAdd} onAdd={handleAdd} />
    </div>
  );
}
