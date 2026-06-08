import { Outlet } from "react-router-dom";

export default function MusiciansLayout() {
  return (
    <div className="py-8">
      <Outlet />
    </div>
  );
}
