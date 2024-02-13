import { useEffect, useRef, useState } from "react";
import { Movie } from "../../../types";
import MovieCard from "../../MovieCards/MovieCard";
import Modal from "../../Global/Modal/Modal";
import Filter from "../Filter/Filter";

type propsRecommended = {
  page: number;
};

type Order = "asc" | "desc";

export default function RecommendedMovie(props: propsRecommended) {
  const { page } = props;
  const [movies, setMovies] = useState<Movie[]>([]);
  // const [moviesBase, setMoviesBase] = useState<Movie[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("rating");
  const [order, setOrder] = useState<Order>("asc");

  async function get_all_movies() {
    const res = await fetch(`https://yts.mx/api/v2/list_movies.json?sort=${sort}&order=${order}&page=${page}&limit=50`, { method: "GET" });
    const responsejson = await res.json();
    if ("movies" in responsejson.data) {
      const arrayTrending = responsejson.data.movies.map((elem) => {
        return {
          id: elem.id,
          title: elem.title,
          year: elem.year,
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
      const tmp_movies: Movie[] = structuredClone(movies);
      Array.prototype.push.apply(tmp_movies, arrayTrending);

      // setMoviesBase(tmp_movies);
      const sortedArray = sortArray(sort, tmp_movies);
      setMovies(sortedArray);
    }
  }

  useEffect(() => {
    get_all_movies();
  }, [page]);

  function handleFiltered(event: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;
  }

  const sortArray = (value: string, array: Movie[]) => {
    let movieTmp = structuredClone(array);
    movieTmp = movieTmp.sort((firstItem, secondItem) => {
      if (firstItem[value] < secondItem[value]) {
        return 1;
      } else if (firstItem[value] == secondItem[value]) {
        return -0;
      } else {
        return -1;
      }
    });
    return movieTmp;
  };
  function handleSort(event: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;
    setSort(value);
    setMovies(sortArray(value, movies));
  }

  return (
    <div className="w-full h-full flex flex-col gap-4  relative">
      <div className="w-full flex gap-4  items-center">
        <span>Recommended for you</span>
        <select
          defaultValue=""
          id="filter"
          className="bg-gray-50 border  w-fit  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="" selected>
            Choose a filter
          </option>
          <option value="rating">imdb rating</option>
          <option value="title">title</option>
          <option value="genre">genre</option>
          <option value="duration"> duration</option>
          <option value="year"> production year</option>
        </select>
        <select
          id="sort"
          defaultValue={sort}
          className="bg-gray-50 border  w-fit  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleSort}
        >
          <option value="" selected>
            sort by
          </option>
          <option value="rating">imdb rating</option>
          <option value="title">title</option>
          {/* <option value="genre">genre</option> */}
          <option value="length"> duration</option>
          <option value="year"> production year</option>
        </select>
      </div>
      <Filter />
      <div className="flex  flex-row flex-wrap gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
