import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
