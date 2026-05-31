import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StaffList from "./pages/StaffList";
import AppointmentAssignment from "./pages/AppointmentAssignment";
import ServiceManagement from "./pages/ServiceManagement";
import CustomerManagement from "./pages/CustomerManagement";
import Reports from "./pages/Reports";

function App() {
  const user = JSON.parse(localStorage.getItem("user")) || null;

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<Navigate to="/" />} />

            {user.role === "admin" && (
              <>
                <Route path="/" element={<Dashboard />} />

                <Route path="/staff" element={<StaffList />} />

                <Route
                  path="/appointments"
                  element={<AppointmentAssignment />}
                />

                <Route path="/services" element={<ServiceManagement />} />

                <Route path="/customers" element={<CustomerManagement />} />

                <Route path="/reports" element={<Reports />} />
              </>
            )}

            {user.role === "staff" && (
              <>
                <Route
                  path="/appointments"
                  element={<AppointmentAssignment />}
                />

                <Route path="*" element={<Navigate to="/appointments" />} />
              </>
            )}

            {user.role === "customer" && (
              <>
                <Route path="/customers" element={<CustomerManagement />} />

                <Route path="*" element={<Navigate to="/customers" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
