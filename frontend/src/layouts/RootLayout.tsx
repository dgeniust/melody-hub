import { Outlet, Link } from "react-router-dom";

export default function RootLayout() {
  return (
    <div>
      <main>
        {/* Các trang con sẽ được render tại đây */}
        <Outlet />
      </main>
    </div>
  );
}
