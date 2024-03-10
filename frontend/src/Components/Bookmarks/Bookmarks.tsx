// frontend/src/Components/Bookmarks/Bookmarks.tsx

import { useEffect, useState } from "react";
import MovieCard from "../MovieCards/MovieCard";
import SearchBar from "../SearchBar/SearchBar";
import data from "../../utils/movies.json";
import { Movie } from "../../types";
import { useTranslation } from "react-i18next";

export default function Bookmarks() {
  const { t } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setMovies(data);
  }, []);

  function handleSearch(search: string) {
    const filteredMovies = data.filter((movie) => {
      return movie.title.toLowerCase().includes(search.toLowerCase());
    });
    setMovies(filteredMovies);
  }

  return (
    <div className="w-full h-max text-quinary p-4 flex flex-col items-center justify-around gap-6 md:p-0 md:pl-9">
      <SearchBar onSearch={handleSearch} />
      <div className="w-full h-full flex flex-col gap-4 ">
        <span>{t('Bookmarks')}</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div >
  );
}
