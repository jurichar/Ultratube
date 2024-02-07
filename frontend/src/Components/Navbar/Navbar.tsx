// frontend/src/Components/Navbar/Navbar.tsx

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useTranslation } from "react-i18next";

export default function Navbar() {
    const { userData } = useAuth();
    const { i18n } = useTranslation();

    const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        i18n.changeLanguage(lang);
    }

    return (
        <nav className="z-50 bg-tertiary fixed top-0 w-full h-14 flex justify-between items-center px-4 md:flex-col md:w-24 md:h-[calc(100vh-4rem)] md:top-8 md:py-8 md:rounded">
            <NavLink to="/">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" viewBox="0 0 25 20">
                    <path d="M20 0L22.5 5H18.75L16.25 0H13.75L16.25 5H12.5L10 0H7.5L10 5H6.25L3.75 0H2.5C1.11875 0 0.0125 1.11875 0.0125 2.5L0 17.5C0 18.8813 1.11875 20 2.5 20H22.5C23.8813 20 25 18.8813 25 17.5V0H20Z" fill="#FC4747" />
                </svg>
            </NavLink>
            <div className="flex flex-row gap-4 justify-center items-center md:flex-col">
                <select className="w-16 h-9 bg-cover bg-no-repeat bg-center transition-all" onChange={changeLanguage}>
                    <option value="en">EN</option>
                    <option value="fr">FR</option>
                    <option value="es">ES</option>
                    <option value="de">DE</option>
                    <option value="it">IT</option>
                    <option value="jp">JP</option>
                    <option value="ru">RU</option>
                </select>
                <NavLink to="/disconnect">
                    <div className="w-16 h-9 bg-[url('./src/assets/exit.svg')] bg-cover bg-no-repeat bg-center transition-all">
                        <div className="w-16 h-9 bg-[url('./src/assets/exit-hover.svg')] bg-cover bg-no-repeat bg-center opacity-0 hover:opacity-50 transition-all">
                        </div>
                    </div>
                </NavLink>
                <NavLink to="/profile">
                    <div className={`w-10 h-10 bg-cover bg-no-repeat bg-center transition-all transform hover:scale-105 outline outline-transparent outline-2 hover:outline-white rounded-full`} style={{
                        backgroundImage: `url(${userData?.avatar})`,
                    }}>
                    </div>
                </NavLink>
            </div>
        </nav>
    )
}
