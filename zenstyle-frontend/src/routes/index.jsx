import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  HomePage,
  AboutPage,
  ServicesPage,
  StaffPage,
  BookingPage,
} from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "ve-chung-toi", element: <AboutPage /> },
      { path: "san-pham", element: <ServicesPage /> },
      { path: "nhan-vien", element: <StaffPage /> },
      { path: "dat-lich", element: <BookingPage /> },
    ],
  },
]);

export default router;
