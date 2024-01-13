// frontend/src/Components/Navbar/Navbar.tsx

import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-tertiary fixed top-0 w-full h-14 flex justify-between items-center px-4">
            <NavLink to="/">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" viewBox="0 0 25 20">
                    <path d="M20 0L22.5 5H18.75L16.25 0H13.75L16.25 5H12.5L10 0H7.5L10 5H6.25L3.75 0H2.5C1.11875 0 0.0125 1.11875 0.0125 2.5L0 17.5C0 18.8813 1.11875 20 2.5 20H22.5C23.8813 20 25 18.8813 25 17.5V0H20Z" fill="#FC4747" />
                </svg>
            </NavLink>
            <NavLink to="/profile">
                <div className="bg-white w-7 h-7 rounded-2xl">
                </div>
            </NavLink>
        </nav>
    )
}