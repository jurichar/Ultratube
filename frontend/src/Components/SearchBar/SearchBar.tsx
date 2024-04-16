// src/Components/SearchBar/SearchBar.tsx

import { useEffect, useState } from "react";
import ButtonCallToAction from "../Global/ButtonCallToAction/ButtonCallToAction";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  onSearch: (search: string) => void;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  showSearch: boolean;
}

const SearchBar = ({ onSearch, setShowSearch, showSearch }: SearchBarProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const handleSubmitSearch = () => {
    if (search.length > 0) {
      setShowSearch(true);
      onSearch(search);
    }
  };

  useEffect(() => {
    return () => {
      setSearch("");
      setShowSearch(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelSearchLocal = () => {
    setSearch("");
    setShowSearch(false);
  };
  return (
    <div className="flex flex-col items-center w-full gap-4 mr-8">
      <div className="flex flex-row items-center w-full h-12 gap-4 border-b px-4 bg-primary border-quaternary focus-within:border-quinary transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.31 12.9L17.71 16.29C17.8993 16.4778 18.0058 16.7334 18.0058 17C18.0058 17.2666 17.8993 17.5222 17.71 17.71C17.5222 17.8993 17.2666 18.0058 17 18.0058C16.7334 18.0058 16.4778 17.8993 16.29 17.71L12.9 14.31C11.5025 15.407 9.77666 16.0022 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16.0022 9.77666 15.407 11.5025 14.31 12.9ZM8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z"
            fill="white"
          />
        </svg>
        <input
          className="w-full outline-none bg-primary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all"
          placeholder={t("search")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <div className="w-24">
          <ButtonCallToAction handleClick={handleSubmitSearch} type="button" value={t("search-button")} name="search" />
        </div>
      </div>
      {showSearch && (
        <div className=" w-full flex flex-col gap-4">
          <ButtonCallToAction handleClick={cancelSearchLocal} type="button" value="cancel search" name="cancel search" />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
