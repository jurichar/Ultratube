// frontend/src/Components/Bookmarks/Bookmarks.tsx

import { useEffect, useState } from "react";
import MovieCard from "../MovieCards/MovieCard";
import { Movie } from "../../types";
import { useTranslation } from "react-i18next";
import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import { notify } from "../../utils/notifyToast";

export default function Bookmarks() {
  const { t } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchAllFavorite();
  }, []);

  const fetchAllFavorite = async () => {
    try {
      const res: Movie[] = await fetchWrapper("api/favourite-movies/", { method: "GET" });
      const newArrayMovie = [];
      for (const elem of res["results"]) {
        newArrayMovie.push({ title: elem.movie.name, year: elem.movie.production_year, image: elem.movie.thumbnail_cover, length: elem.movie.duration, ...elem.movie });
      }
      setMovies(newArrayMovie);
    } catch (error) {
      notify({ type: "error", msg: "Cant get all favorite movie" });
    }
    console.log("hello");
  };

  return (
    <div className="w-full h-max text-quinary p-4 flex flex-col items-center justify-around gap-6 md:p-0 md:pl-9">
      <div className="w-full h-full flex flex-col gap-4 ">
        <span>{t("Bookmarks")}</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {" "}
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}{" "}
        </div>
      </div>
    </div>
  );
}
