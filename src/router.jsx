import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "./App";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StaffList from "./pages/StaffList";
import CustomerManagement from "./pages/CustomerManagement";
import ServiceManagement from "./pages/ServiceManagement";
import AppointmentAssignment, {
  loader as appointmentLoader,
} from "./pages/AppointmentAssignment";
import Reports from "./pages/Reports";

const user = JSON.parse(localStorage.getItem("user"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: user ? <App /> : <Navigate to="/login" />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "staff",
        element: <StaffList />,
      },

      {
        path: "customers",
        element: <CustomerManagement />,
      },

      {
        path: "services",
        element: <ServiceManagement />,
      },

      {
        path: "appointments",
        element: <AppointmentAssignment />,
        loader: appointmentLoader,
      },

      {
        path: "reports",
        element: <Reports />,
      },
    ],
  },
]);

export default router;
