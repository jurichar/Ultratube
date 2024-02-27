/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { Movie, Order, YtsMovie, filter } from "../../../types";
import MovieCard from "../../MovieCards/MovieCard";

type propsRecommended = {
  filter: filter;
  order: Order;
  page: number;
  sort: string;
  filterSort: (currentMovie: Movie[], arrayMovie: Movie[]) => Movie[];
};

export default function RecommendedMovie(props: propsRecommended) {
  const { filter, order, page, sort, filterSort } = props;
  const [movies, setMovies] = useState<Movie[]>([]);

  const getMoviesJson = useCallback(async () => {
    const url = `https://yts.mx/api/v2/list_movies.json?minimum_rating=${filter.rating}&genre=${filter.genre}&query_term=${filter.name}&sort=${sort}&order=${order}&page=${page}&limit=50`;
    try {
      const response = await fetch(url, { method: "GET", headers: { Cookie: document.cookie } });
      const movieResponse = await response.json();
      if ("movies" in movieResponse.data) {
        const all_Movie_Data: YtsMovie[] = movieResponse.data.movies;
        const arrayMovie: Movie[] = all_Movie_Data.map((elem) => {
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
        return arrayMovie;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, [filter, order, page, sort]);

  useEffect(() => {
    async function setUpMovies() {
      const resultMovies = await getMoviesJson();
      if (resultMovies) {
        const movieFiltered = filterSort(movies, resultMovies);
        setMovies(movieFiltered);
      }
    }
    setUpMovies();
  }, [filter, page, getMoviesJson, sort]);
  return (
    <div className="w-full h-full flex  pb-60 flex-col gap-4  relative">
      <div className="flex  flex-row flex-wrap gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
