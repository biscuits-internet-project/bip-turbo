import { Outlet } from "react-router-dom";

export default function SongsLayout() {
  return (
    <div className="py-8">
      <Outlet />
    </div>
  );
}
