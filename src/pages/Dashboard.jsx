import staffsData from "../data/staffs";
import appointmentsData from "../data/appointments";
import customersData from "../data/customers";
import servicesData from "../data/services";

import {
  Users,
  Calendar,
  UserCheck,
  CheckCircle,
  DollarSign,
} from "lucide-react";

export default function Dashboard() {
  const staffs = JSON.parse(localStorage.getItem("staffs")) || staffsData;

  const appointments =
    JSON.parse(localStorage.getItem("appointments")) || appointmentsData;

  const customers =
    JSON.parse(localStorage.getItem("customers")) || customersData;

  const services = JSON.parse(localStorage.getItem("services")) || servicesData;

  const totalStaff = staffs.length;

  const totalCustomers = customers.length;

  const totalAppointments = appointments.length;

  const activeStaff = staffs.filter(
    (staff) => staff.status === "Active",
  ).length;

  const assignedAppointments = appointments.filter(
    (appointment) => appointment.staff && appointment.staff !== "Unassigned",
  ).length;

  const totalRevenue = appointments.reduce((sum, appointment) => {
    const service = services.find((s) => s.name === appointment.service);

    return sum + (service?.price || 0);
  }, 0);

  const cards = [
    {
      title: "Total Staff",
      value: totalStaff,
      icon: <Users size={32} />,
    },
    {
      title: "Customers",
      value: totalCustomers,
      icon: <Users size={32} />,
    },
    {
      title: "Appointments",
      value: totalAppointments,
      icon: <Calendar size={32} />,
    },
    {
      title: "Active Staff",
      value: activeStaff,
      icon: <UserCheck size={32} />,
    },
    {
      title: "Assigned",
      value: assignedAppointments,
      icon: <CheckCircle size={32} />,
    },
    {
      title: "Revenue",
      value: `${totalRevenue.toLocaleString()} VNĐ`,
      icon: <DollarSign size={32} />,
    },
  ];

  const bestStaff =
    staffs.length > 0
      ? staffs.reduce((best, current) =>
          current.assignedCustomers > best.assignedCustomers ? current : best,
        )
      : null;

  const topService =
    services.length > 0
      ? services.reduce((best, current) =>
          current.price > best.price ? current : best,
        )
      : null;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">{card.title}</p>

                <h2 className="text-3xl font-bold mt-3">{card.value}</h2>
              </div>

              <div className="text-gray-700">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-gray-500 mb-2">Best Staff</h2>

          <p className="text-2xl font-bold">{bestStaff?.name}</p>

          <p className="text-gray-500">
            {bestStaff?.assignedCustomers} assigned customers
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-gray-500 mb-2">Highest Value Service</h2>

          <p className="text-2xl font-bold">{topService?.name}</p>

          <p className="text-gray-500">
            {topService?.price?.toLocaleString()} VNĐ
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Welcome to ZenStyle Salon Management
        </h2>

        <p className="text-gray-600">
          Manage staff, appointments, services, customers and reports from one
          dashboard.
        </p>
      </div>
    </div>
  );
}
