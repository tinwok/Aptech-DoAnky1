import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Calendar,
  Scissors,
  UserRound,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Staff Management",
      path: "/staff",
      icon: <Users size={18} />,
    },
    {
      name: "Appointment Assignment",
      path: "/appointments",
      icon: <Calendar size={18} />,
    },
    {
      name: "Service Management",
      path: "/services",
      icon: <Scissors size={18} />,
    },
    {
      name: "Customer Management",
      path: "/customers",
      icon: <UserRound size={18} />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart3 size={18} />,
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-black text-white p-5">
      <h2 className="text-3xl font-bold mb-10 text-center">ZenStyle</h2>

      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${
                location.pathname === item.path
                  ? "bg-white text-black font-semibold"
                  : "hover:bg-zinc-800"
              }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
