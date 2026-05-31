import { useState, useEffect } from "react";

import {
  Users,
  Calendar,
  UserCheck,
  CheckCircle,
  DollarSign,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const [staffs, setStaffs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const loadData = async () => {
    try {
      const [staffRes, customerRes, serviceRes, appointmentRes] =
        await Promise.all([
          fetch("http://localhost:5000/api/staffs"),
          fetch("http://localhost:5000/api/customers"),
          fetch("http://localhost:5000/api/services"),
          fetch("http://localhost:5000/api/appointments"),
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

  const activeStaff = staffs.filter(
    (staff) => staff.status === "Active",
  ).length;

  const assignedAppointments = appointments.filter(
    (appointment) => appointment.staff && appointment.staff !== "Unassigned",
  ).length;

  const totalRevenue = appointments.reduce((sum, appointment) => {
    const service = services.find((s) => s.name === appointment.service);

    return sum + Number(service?.price || 0);
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
      ? staffs.reduce((best, current) => {
          const bestCount = appointments.filter(
            (a) => a.staff === best.name,
          ).length;

          const currentCount = appointments.filter(
            (a) => a.staff === current.name,
          ).length;

          return currentCount > bestCount ? current : best;
        })
      : null;

  const topService =
    services.length > 0
      ? services.reduce((best, current) =>
          Number(current.price) > Number(best.price) ? current : best,
        )
      : null;

  const chartData = [
    {
      name: "Staff",
      value: totalStaff,
    },
    {
      name: "Customers",
      value: totalCustomers,
    },
    {
      name: "Appointments",
      value: totalAppointments,
    },
    {
      name: "Services",
      value: services.length,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>

                <h2 className="text-4xl font-bold mt-2 text-black">
                  {card.value}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-black">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-gray-500 mb-2">Best Staff</h2>

          <p className="text-2xl font-bold">{bestStaff?.name}</p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-gray-500 mb-2">Highest Value Service</h2>

          <p className="text-2xl font-bold">{topService?.name}</p>

          <p className="text-gray-500">
            {Number(topService?.price || 0).toLocaleString()} VNĐ
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">System Statistics</h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
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
