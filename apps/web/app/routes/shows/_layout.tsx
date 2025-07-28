import { Outlet } from "react-router-dom";

export default function ShowsLayout() {
  return (
    <div className="py-8">
      <Outlet />
    </div>
  );
}
