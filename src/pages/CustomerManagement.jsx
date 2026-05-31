import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import AddCustomerDialog from "../components/customer/AddCustomerDialog";
import EditCustomerDialog from "../components/customer/EditCustomerDialog";

export default function CustomerManagement() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loadCustomers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/customers");
      const data = await res.json();

      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadCustomers();
    };

    fetchData();
  }, []);

  const handleAdd = async (newCustomer) => {
    try {
      await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });

      loadCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: "DELETE",
      });

      loadCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (updatedCustomer) => {
    try {
      await fetch(`http://localhost:5000/api/customers/${updatedCustomer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCustomer),
      });

      loadCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search),
  );

  const totalCustomers = customers.length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Management</h1>

        <Button onClick={() => setOpenAdd(true)}>Add Customer</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-5">
          <p className="text-gray-500">Total Customers</p>

          <p className="text-3xl font-bold mt-2">{totalCustomers}</p>
        </div>

        <div className="border rounded-lg p-5">
          <p className="text-gray-500">Active Customers</p>

          <p className="text-3xl font-bold mt-2">
            {
              customers.filter((customer) => customer.status === "Active")
                .length
            }
          </p>
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
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Gender</th>
            <th className="p-3 text-left">Status</th>
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

              <td className="p-3">{customer.email}</td>

              <td className="p-3">{customer.gender}</td>

              <td className="p-3">{customer.status}</td>

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
              <td colSpan={6} className="text-center p-4">
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
