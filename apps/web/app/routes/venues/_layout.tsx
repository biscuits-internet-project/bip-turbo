import { Outlet } from "react-router-dom";

export default function VenuesLayout() {
  return (
    <div className="py-8">
      <Outlet />
    </div>
  );
}
