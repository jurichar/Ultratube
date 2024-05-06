// frontend/src/Components/Navbar/Navbar.tsx

import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/useAuth";
import { language } from "../../types";
import DisconnectButton from "../Global/DisconnectButton/DisconnectButton";

export default function Navbar() {
  const { i18n } = useTranslation();
  const { setLanguageSelected, userData } = useAuth();

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang: language = e.target.value;
    setLanguageSelected(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="z-50 bg-tertiary mx-4 sticky top-0 md:top-4 w-full flex justify-between items-center px-4 md:flex-col md:w-24  md:h-[calc(100vh-2rem)] md:py-8 md:rounded">
      <NavLink to="/">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" viewBox="0 0 25 20">
          <path
            d="M20 0L22.5 5H18.75L16.25 0H13.75L16.25 5H12.5L10 0H7.5L10 5H6.25L3.75 0H2.5C1.11875 0 0.0125 1.11875 0.0125 2.5L0 17.5C0 18.8813 1.11875 20 2.5 20H22.5C23.8813 20 25 18.8813 25 17.5V0H20Z"
            fill="#FC4747"
          />
        </svg>
      </NavLink>
      <div className="flex flex-row gap-4 justify-center items-center md:flex-col">
        <select className="w-14 h-9 bg-white border border-gray-300 rounded-md text-gray-700 p-2" onChange={changeLanguage}>
          <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
          <option value="en" className="bg-gray-100 text-gray-700">
            EN
          </option>
          <option value="fr">FR</option>
          <option value="es">ES</option>
        </select>
        <div>
          <NavLink className="text-secondary text-heading-sm" to="/watch-movie-conversion">
            CONV
          </NavLink>
        </div>
        {userData && (
          <>
            <NavLink to="/bookmarks">
              <svg width="54" height="54" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M20.7112 9.771L20.7215 9.77548L20.7319 9.77965C20.7992 9.80657 20.8386 9.84049 20.8705 9.88692C20.9032 9.93458 20.9167 9.97786 20.9167 10.0364V21.9636C20.9167 22.0221 20.9032 22.0654 20.8705 22.1131C20.8386 22.1595 20.7992 22.1934 20.7319 22.2203L20.7237 22.2236L20.7156 22.2271C20.7107 22.2292 20.6807 22.2407 20.6094 22.2407C20.5085 22.2407 20.4397 22.2142 20.3686 22.15L16.3572 18.2346L15.8333 17.7233L15.3095 18.2346L11.2975 22.1505C11.2129 22.2276 11.1421 22.25 11.0573 22.25C11.02 22.25 10.9882 22.2433 10.9555 22.229L10.9452 22.2245L10.9347 22.2203C10.8674 22.1934 10.8281 22.1595 10.7962 22.1131C10.7635 22.0654 10.75 22.0221 10.75 21.9636V10.0364C10.75 9.97786 10.7635 9.93458 10.7962 9.88692C10.8281 9.84049 10.8674 9.80657 10.9347 9.77965L10.9452 9.77548L10.9555 9.771C10.9882 9.75674 11.02 9.75 11.0573 9.75H20.6094C20.6466 9.75 20.6784 9.75674 20.7112 9.771Z"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </NavLink>
            <NavLink to="/watched-list">
              <img src="http://localhost:3000/src/assets/image.png" />
            </NavLink>
            <div className="flex flex-row gap-4 justify-center items-center text-sm md:flex-col">
              <NavLink to="/profile">
                <div
                  className={`w-10 h-10 bg-cover bg-no-repeat bg-center transition-all transform hover:scale-105 outline outline-transparent outline-2 hover:outline-white rounded-full`}
                  style={{
                    backgroundImage: `url(${userData?.avatar})`,
                  }}
                ></div>
              </NavLink>
              <DisconnectButton />
            </div>
          </>
        )}
        {!userData && (
          <>
            <NavLink to="/register" className="text-secondary text-heading-sm">
              {" "}
              Register{" "}
            </NavLink>
            <NavLink to="/login" className="text-secondary text-heading-sm">
              {" "}
              Login{" "}
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
