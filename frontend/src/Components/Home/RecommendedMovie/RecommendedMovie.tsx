import { useCallback, useEffect, useState } from "react";
import { Movie, filter } from "../../../types";
import MovieCard from "../../MovieCards/MovieCard";
import Filter from "../Filter/Filter";

type propsRecommended = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

type Order = "asc" | "desc";

export default function RecommendedMovie(props: propsRecommended) {
  const { page, setPage } = props;
  const [movies, setMovies] = useState<Movie[]>([]);
  // const [moviesBase, setMoviesBase] = useState<Movie[]>([]);
  const initialState = { rating: 0, genre: "all", min_year_release: 1900, duration: "all", name: "" };
  const [filter, setFilter] = useState<filter>(initialState);
  const [sort, setSort] = useState<string>("rating");
  const [order, setOrder] = useState<Order>("asc");

  const getMoviesJson = useCallback(async () => {
    const url = `https://yts.mx/api/v2/list_movies.json?minimum_rating=${filter.rating}&genre=${filter.genre}&query_term=${filter.name}&sort=${sort}&order=${order}&page=${page}&limit=50`;
    try {
      const response = await fetch(url, { method: "GET" });
      const movieResponse = await response.json();
      if ("movies" in movieResponse.data) {
        let arrayMovie: Movie[] = movieResponse.data.movies.map((elem) => {
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
        if (filter.duration != "all") {
          if (filter.duration == "u_60") {
            arrayMovie = arrayMovie.filter(({ length }) => length <= 60);
          } else if (filter.duration == "60-120") {
            arrayMovie = arrayMovie.filter(({ length }) => {
              if (length >= 60 && length <= 120) {
                return true;
              } else {
                return false;
              }
            });
            console.log(arrayMovie);
          } else if (filter.duration == "a_120") {
            arrayMovie = arrayMovie.filter(({ length }) => length >= 120);
          }
        }
        return arrayMovie;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, [filter, order, page, sort]);

  useEffect(() => {
    async function setUpMovies() {
      const movieFiltered = await getMoviesJson();
      if (movieFiltered) {
        setMovies((prev) => {
          let array = [...prev, ...movieFiltered];
          array = sortArray(sort, array);
          const duplicateMovies = [...new Map(array.map((movie) => [movie.id, movie])).values()];
          return duplicateMovies;
        });
      }
    }
    setUpMovies();
  }, [page, getMoviesJson, sort]);

  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [filter, setPage]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = event.target;
    if (type == "number") {
      if (!isNaN(event.target.valueAsNumber)) {
        setFilter({ ...filter, [name]: event.target.valueAsNumber });
      }
    } else {
      setFilter({ ...filter, [name]: value });
    }
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
    <div className="w-full h-full flex  pb-60 flex-col gap-4  relative">
      <div className="w-full flex gap-4  items-center">
        <span>Recommended for you</span>
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
      <Filter filter={filter} setFilter={setFilter} initialState={initialState} handleChange={handleChange} />
      <div className="flex  flex-row flex-wrap gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
