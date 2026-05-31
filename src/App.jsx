import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import StaffList from "./pages/StaffList";
import AppointmentAssignment from "./pages/AppointmentAssignment";
import ServiceManagement from "./pages/ServiceManagement";
import CustomerManagement from "./pages/CustomerManagement";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/staff" element={<StaffList />} />

            <Route path="/appointments" element={<AppointmentAssignment />} />

            <Route path="/services" element={<ServiceManagement />} />

            <Route path="/customers" element={<CustomerManagement />} />

            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
