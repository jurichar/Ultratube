// frontend/src/Components/Root/Root.tsx

import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

export default function Root() {

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="bg-primary flex-1 overflow-y-auto pt-14">
        <Outlet />
      </div>
    </div >
  );
}