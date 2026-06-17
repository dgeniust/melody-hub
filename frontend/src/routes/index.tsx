import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import AuthPages from "../pages/AuthPages";
import Dashboard from "../pages/Dashboard";
import AboutUs from "../pages/AboutUs";
import LicensePage from "../pages/LicensePage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Bọc Layout bên ngoài
    // errorElement: <NotFound />,
    children: [
      {
        index: true, // Đường dẫn mặc định (/)
        element: <Dashboard />,
      },
      {
        path: "auth", // Đường dẫn /login
        element: <AuthPages />,
      },
      {
        path: "about-us", // Đường dẫn /login
        element: <AboutUs />,
      },
      {
        path: "license", // Đường dẫn /login
        element: <LicensePage />,
      },
    ],
  },
]);
