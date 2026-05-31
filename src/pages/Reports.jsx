import staffsData from "../data/staffs";
import appointmentsData from "../data/appointments";
import customersData from "../data/customers";
import servicesData from "../data/services";

export default function Reports() {
  const staffs = JSON.parse(localStorage.getItem("staffs")) || staffsData;

  const customers =
    JSON.parse(localStorage.getItem("customers")) || customersData;

  const services = JSON.parse(localStorage.getItem("services")) || servicesData;

  const appointments =
    JSON.parse(localStorage.getItem("appointments")) || appointmentsData;

  const totalStaff = staffs.length;

  const activeStaff = staffs.filter(
    (staff) => staff.status === "Active",
  ).length;

  const totalCustomers = customers.length;

  const totalAppointments = appointments.length;

  const totalServices = services.length;

  const totalRevenue = appointments.reduce((sum, appointment) => {
    const service = services.find((s) => s.name === appointment.service);

    return sum + (service?.price || 0);
  }, 0);

  const bestStaff =
    staffs.length > 0
      ? staffs.reduce((best, current) =>
          current.assignedCustomers > best.assignedCustomers ? current : best,
        )
      : null;

  const topCustomer =
    customers.length > 0
      ? customers.reduce((best, current) =>
          current.visits > best.visits ? current : best,
        )
      : null;

  const serviceCount = {};

  appointments.forEach((appointment) => {
    serviceCount[appointment.service] =
      (serviceCount[appointment.service] || 0) + 1;
  });

  const mostPopularService =
    Object.keys(serviceCount).length > 0
      ? Object.keys(serviceCount).reduce((a, b) =>
          serviceCount[a] > serviceCount[b] ? a : b,
        )
      : "No Service";

  const recentAppointments = [...appointments].reverse();

  return (
    <div className="p-8">
      {" "}
      <h1 className="text-3xl font-bold mb-8">Reports </h1>
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
          <h2 className="text-gray-500">Most Popular Service</h2>

          <p className="text-xl font-bold mt-2">{mostPopularService}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">Top Customer</h2>

          <p className="text-xl font-bold mt-2">{topCustomer?.name}</p>

          <p className="text-gray-500">{topCustomer?.visits} visits</p>
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

                <td className="p-3">{appointment.staff}</td>

                <td className="p-3">{appointment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
