/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { Movie, Order, YtsMovie, filter } from "../../../types";
import MovieCard from "../../MovieCards/MovieCard";
import { useAuth } from "../../../context/useAuth";

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
  const { languageSelected } = useAuth();

  const getMoviesJson = useCallback(async () => {
    const url = `https://yts.mx/api/v2/list_movies.json?minimum_rating=${filter.rating}&genre=${filter.genre_en}&query_term=${filter.name}&sort=${sort}&order=${order}&page=${page}&limit=50`;
    try {
      const response = await fetch(url, { method: "GET", headers: { "Accept-Language": languageSelected } });
      const movieResponse = await response.json();
      if ("movies" in movieResponse.data) {
        const all_Movie_Data: YtsMovie[] = movieResponse.data.movies;
        const arrayMovie: Movie[] = all_Movie_Data.map((elem) => {
          const quality = Array.isArray(elem.torrents) && elem.torrents?.length > 0 ? elem.torrents[0].quality : elem.torrents.quality;
          const torrent_url = Array.isArray(elem.torrents) && elem.torrents?.length > 0 ? elem.torrents[0].url : elem.torrents.url;
          const torrent_hash = Array.isArray(elem.torrents) && elem.torrents?.length > 0 ? elem.torrents[0].hash : elem.torrents.hash;
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
            quality: quality,
            torrent: torrent_url,
            torrent_hash: torrent_hash,
          };
        });
        return arrayMovie;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, [filter, order, page, sort, languageSelected]);

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
