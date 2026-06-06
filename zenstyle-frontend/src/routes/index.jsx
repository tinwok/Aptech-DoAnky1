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
      { path: "about-us", element: <AboutPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "staff", element: <StaffPage /> },
      { path: "booking", element: <BookingPage /> },
    ],
  },
]);

export default router;
