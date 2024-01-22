// frontend/src/Components/Root/Root.tsx

import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { User } from '../../types';
export default function Root() {
  const user: User = {
    id: "1",
    name: "John Doe",
    avatar: "./src/assets/profiles/1.svg",
    password: "123456",
    email: "",
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar user={user} />
      <div className="bg-primary flex-1 overflow-y-auto pt-14">
        <Outlet />
      </div>
    </div >
  );
}