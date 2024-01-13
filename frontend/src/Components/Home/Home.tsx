// frontend/src/Components/Home/Home.tsx

import { useEffect, useState } from "react";
import MovieCard from "../MovieCards/MovieCard";
import MovieCardTrending from "../MovieCards/MovieCardTrending";
import SearchBar from "../SearchBar/SearchBar";
import data from "../../utils/data_all.json";
import dataTrending from "../../utils/data_trending.json";
import { Movie } from "../../types";

export default function Home() {
  const [moviesTrending, setMoviesTrending] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setMoviesTrending(dataTrending);
    setMovies(data);
  }, []);

  return (
    <div className="w-full h-max text-quinary p-4 flex flex-col items-center justify-around gap-6">
      <SearchBar />
      <div className="w-full h-full flex flex-col gap-4 ">
        <span>Trending</span>
        <div className="overflow-x-auto w-full flex flex-row gap-4">
          {moviesTrending.map((movie) => (
            <MovieCardTrending key={movie.id} movie={movie} />
          ))}
        </div>
      </div >
      <div className="w-full h-full flex flex-col gap-4 ">
        <span>Recommended for you</span>
        <div className="flex flex-row flex-wrap gap-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div >
  );
}
