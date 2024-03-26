// frontend/src/Components/Root/Root.tsx

import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function Root() {
  return (
    <div className=" bg-primary flex md:flex-row sm:flex-col  flex-col   min-h-screen">
      <Navbar />
      <div className="flex-1 overflow-y-auto ">
        <Outlet />
      </div>
    </div>
  );
}
