// frontend/src/Components/Home/Home.tsx

import { useEffect, useState } from "react";
import MovieCardTrending from "../MovieCards/MovieCardTrending";
import SearchBar from "../SearchBar/SearchBar";
import { Movie } from "../../types";
import RecommendedMovie from "./RecommendedMovie/RecommendedMovie";

export default function Home() {
  const [moviesTrending, setMoviesTrending] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);

  function handleSearch(search: string) {
    const filteredMovies = movies.filter((movie) => {
      return movie.title.toLowerCase().includes(search.toLowerCase());
    });
    setMovies(filteredMovies);
  }

  async function get_trending_movie() {
    try {
      const all_movies_res = await fetch(`https://yts.mx/api/v2/list_movies.json?sort=seed&page=1`, { method: "GET" });
      const all_movies_json = await all_movies_res.json();
      if ("movies" in all_movies_json.data) {
        const arrayTrending = all_movies_json.data.movies.map((elem) => {
          console.log(elem);
          return {
            id: elem.id,
            title: elem.title,
            release: elem.year,
            image: elem.medium_cover_image,
            synopsis: elem.synopsis,
            trailer: elem.yt_trailer_code,
            imdb_link: elem.imdb_code,
            genres: elem.genres,
            language: elem.language,
            rating: elem.rating,
            summary: elem.summary,
            length: elem.runtime,
          };
        });
        setMoviesTrending(arrayTrending);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    function watchScroll() {
      window.addEventListener(
        "scroll",
        function () {
          handleScrollInfinite();
        },
        false
      );
    }
    watchScroll();
    return () => {
      document.removeEventListener("scroll", handleScrollInfinite);
    };
  }, []);

  function handleScrollInfinite() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage((prev) => prev + 1);
    }
  }
  useEffect(() => {
    get_trending_movie();
    return () => {};
  }, []);

  return (
    <div className="w-full h-max text-quinary p-4 flex flex-col items-center justify-around gap-6">
      <SearchBar onSearch={handleSearch} />
      <div className="w-full h-full flex flex-col gap-4 ">
        <span>Trending</span>
        <div className="overflow-x-auto w-full flex flex-row gap-4">
          {moviesTrending.map((movie) => (
            <MovieCardTrending key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
      <RecommendedMovie page={page} setPage={setPage} />
    </div>
  );
}
