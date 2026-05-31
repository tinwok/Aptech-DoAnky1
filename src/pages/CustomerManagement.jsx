import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import AddCustomerDialog from "../components/customer/AddCustomerDialog";
import EditCustomerDialog from "../components/customer/EditCustomerDialog";

const defaultCustomers = [
  {
    id: 1,
    name: "Alice",
    phone: "0901234567",
    visits: 5,
  },
  {
    id: 2,
    name: "Tom",
    phone: "0908888888",
    visits: 2,
  },
  {
    id: 3,
    name: "Sophia",
    phone: "0909999999",
    visits: 8,
  },
];

export default function CustomerManagement() {
  const [search, setSearch] = useState("");

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("customers");

    return saved ? JSON.parse(saved) : defaultCustomers;
  });

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  const handleAdd = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const handleEdit = (updatedCustomer) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer,
      ),
    );
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search),
  );

  const totalCustomers = customers.length;

  const totalVisits = customers.reduce(
    (sum, customer) => sum + customer.visits,
    0,
  );

  const topCustomer =
    customers.length > 0
      ? customers.reduce((prev, current) =>
          prev.visits > current.visits ? prev : current,
        )
      : null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Management</h1>

        <Button onClick={() => setOpenAdd(true)}>Add Customer</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-5 hover:shadow-md transition">
          <p className="text-gray-500">Total Customers</p>

          <p className="text-3xl font-bold mt-2">{totalCustomers}</p>
        </div>

        <div className="border rounded-lg p-5 hover:shadow-md transition">
          <p className="text-gray-500">Top Customer</p>

          <p className="text-2xl font-bold mt-2">{topCustomer?.name}</p>

          <p className="text-gray-500">{topCustomer?.visits} visits</p>
        </div>

        <div className="border rounded-lg p-5 hover:shadow-md transition">
          <p className="text-gray-500">Total Visits</p>

          <p className="text-3xl font-bold mt-2">{totalVisits}</p>
        </div>
      </div>

      <div className="mb-6">
        <Input
          className="shadow-sm"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full border rounded-lg overflow-hidden">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3 text-left">Name</th>

            <th className="p-3 text-left">Phone</th>

            <th className="p-3 text-left">Visits</th>

            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredCustomers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-3 font-medium">{customer.name}</td>

              <td className="p-3">{customer.phone}</td>

              <td className="p-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {customer.visits} visits
                </span>
              </td>

              <td className="p-3 flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setOpenEdit(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}

          {filteredCustomers.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <AddCustomerDialog
        open={openAdd}
        setOpen={setOpenAdd}
        onAdd={handleAdd}
      />

      <EditCustomerDialog
        open={openEdit}
        setOpen={setOpenEdit}
        customer={selectedCustomer}
        onSave={handleEdit}
      />
    </div>
  );
}
