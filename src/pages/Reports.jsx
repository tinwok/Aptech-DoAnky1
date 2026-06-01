import { useState, useEffect } from "react";

export default function Reports() {
  const [staffs, setStaffs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const loadData = async () => {
    try {
      const [staffRes, customerRes, serviceRes, appointmentRes] =
        await Promise.all([
          fetch("http://127.0.0.1:8000/api/staffs"),
          fetch("http://127.0.0.1:8000/api/customers"),
          fetch("http://127.0.0.1:8000/api/services"),
          fetch("http://127.0.0.1:8000/api/appointments"),
        ]);

      const staffsData = await staffRes.json();
      const customersData = await customerRes.json();
      const servicesData = await serviceRes.json();
      const appointmentsData = await appointmentRes.json();

      setStaffs(staffsData);
      setCustomers(customersData);
      setServices(servicesData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  }, []);

  const totalStaff = staffs.length;
  const totalCustomers = customers.length;
  const totalAppointments = appointments.length;
  const totalServices = services.length;

  const activeStaff = staffs.filter(
    (staff) => staff.status === "Active",
  ).length;

  const totalRevenue = appointments.reduce((sum, appointment) => {
    const service = services.find((s) => s.name === appointment.service);

    return sum + Number(service?.price || 0);
  }, 0);
  const bestStaff = staffs.length > 0 ? staffs[0] : null;

  const topCustomer = customers.length > 0 ? customers[0] : null;

  const topService =
    services.length > 0
      ? services.reduce((best, current) =>
          Number(current.price) > Number(best.price) ? current : best,
        )
      : null;

  const recentAppointments = [...appointments].reverse();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Reports</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">Total Revenue</h2>

          <p className="text-3xl font-bold mt-2">
            {totalRevenue.toLocaleString()} VNĐ
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">Total Customers</h2>

          <p className="text-3xl font-bold mt-2">{totalCustomers}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">Total Appointments</h2>

          <p className="text-3xl font-bold mt-2">{totalAppointments}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">Total Staff</h2>

          <p className="text-3xl font-bold mt-2">{totalStaff}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">Active Staff</h2>

          <p className="text-3xl font-bold mt-2">{activeStaff}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">Total Services</h2>

          <p className="text-3xl font-bold mt-2">{totalServices}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">Highest Value Service</h2>

          <p className="text-xl font-bold mt-2">{topService?.name}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">Top Customer</h2>

          <p className="text-xl font-bold mt-2">{topCustomer?.name}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">Best Staff</h2>

          <p className="text-xl font-bold mt-2">{bestStaff?.name}</p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold">Recent Appointments</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left">Customer</th>

              <th className="p-3 text-left">Service</th>

              <th className="p-3 text-left">Staff</th>

              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {recentAppointments.map((appointment) => (
              <tr key={appointment.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{appointment.customer}</td>

                <td className="p-3">{appointment.service}</td>

                <td className="p-3">{appointment.staff || "Unassigned"}</td>

                <td className="p-3">
                  {appointment.date
                    ? new Date(appointment.date).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
