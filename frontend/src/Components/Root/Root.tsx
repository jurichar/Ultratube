// frontend/src/Components/Root/Root.tsx

import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { User } from '../../types';
import users from '../../utils/users.json';

export default function Root() {
  const user: User = users[0];

  return (
    <div className="bg-primary flex flex-col h-screen md:flex-row md:p-8">
      <Navbar user={user} />
      <div className="bg-primary flex-1 overflow-y-auto pt-14 md:pt-0 md:pl-24 ">
        <Outlet />
      </div>
    </div >
  );
}