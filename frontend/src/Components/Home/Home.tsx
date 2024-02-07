// frontend/src/Components/Home/Home.tsx

import { useEffect, useState } from "react";
import MovieCard from "../MovieCards/MovieCard";
import MovieCardTrending from "../MovieCards/MovieCardTrending";
import SearchBar from "../SearchBar/SearchBar";
import data from "../../utils/movies.json";
import dataTrending from "../../utils/trending.json";
import { Movie } from "../../types";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const [moviesTrending, setMoviesTrending] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setMoviesTrending(dataTrending);
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
        <span>{t('trending')}</span>
        <div className="overflow-x-auto w-full flex flex-row gap-4">
          {moviesTrending.map((movie) => (
            <MovieCardTrending key={movie.id} movie={movie} />
          ))}
        </div>
      </div >
      <div className="w-full h-full flex flex-col gap-4 ">
        <span>{t('recommended')}</span>
        <div className="flex flex-row flex-wrap gap-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div >
  );
}
