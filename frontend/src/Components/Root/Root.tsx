import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <nav>bjr</nav>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
