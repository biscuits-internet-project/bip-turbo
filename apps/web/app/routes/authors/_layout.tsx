import { Outlet } from "react-router-dom";

export default function AuthorsLayout() {
  return (
    <div className="py-1">
      <Outlet />
    </div>
  );
}
