// frontend/src/Components/Root/Root.tsx

import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { User } from '../../types';
import users from '../../utils/users.json';

export default function Root() {
  const user: User = users[0];

  return (
    <div className="flex flex-col h-screen">
      <Navbar user={user} />
      <div className="bg-primary flex-1 overflow-y-auto pt-14">
        <Outlet />
      </div>
    </div >
  );
}