/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { ApiTorrentMovie, Movie, Order, YtsMovie, filter } from "../../types";
import MovieCard from "../MovieCards/MovieCard";
import ptt from "parse-torrent-title";
import { useAuth } from "../../context/useAuth";
type searchResultProps = {
  showSearch: boolean;
  querySearch: string;
  filter: filter;
  sort: string;
  order: Order;
  page: number;
  movieSeen?: [{ movie: Movie }];
  filterSort: (currentMovie: Movie[], arrayMovie: Movie[]) => Movie[];
};

export default function SearchResult(props: searchResultProps) {
  const { querySearch, filter, sort, filterSort, order, page, movieSeen } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const { languageSelected } = useAuth();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer  ${import.meta.env.VITE_TIMDB_ACCESS_KEY}`,
    },
  };

  const normalize_name_movie = (name: string) => {
    const parsedInfo = ptt.parse(name);
    return { nameNormalize: parsedInfo.title, movieResolution: parsedInfo.resolution };
  };
  const get_info_movie = async (name: string, movieResoluton: string, torrentUrl: string, hash: string) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${name}`, options);
      const json = await response.json();
      if (json.results && json.results.length > 0) {
        const timdb_movie = json.results[0];
        const responseTmdb = await fetch(`https://api.themoviedb.org/3/movie/${timdb_movie.id}?append_to_response=videos&language=${languageSelected}`, options);
        const jsonTmdb = await responseTmdb.json();
        let trailer = "";
        if (jsonTmdb.videos && jsonTmdb.videos.results && jsonTmdb.videos.results.length > 0) {
          trailer = jsonTmdb.videos.results[0].key;
        }
        return {
          id: jsonTmdb.id,
          title: jsonTmdb.title,
          year: new Date(jsonTmdb.release_date).getFullYear(),
          synopsis: jsonTmdb.overview,
          rating: jsonTmdb.vote_average,
          imdb_link: jsonTmdb.imdb_id,
          image: "https://media.themoviedb.org/t/p/w220_and_h330_face/" + jsonTmdb.poster_path,
          summary: "",
          genres: jsonTmdb?.genres?.map((genre: { name: string }) => genre.name),
          language: jsonTmdb.original_language,
          quality: movieResoluton,
          length: jsonTmdb.runtime,
          trailer: trailer,
          torrent: torrentUrl,
          torrent_hash: hash,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function searchMovies(query: string) {
    try {
      setLoading(true);
      setMovies([]);
      const response = await fetch(`http://127.0.0.1:8009/api/v1/search?site=torlock&query=${query}`, { method: "GET", headers: { "Accept-Language": languageSelected } });
      const data = await response.json();
      setLoading(false);
      if (data.data) {
        const apiResponseMovie: ApiTorrentMovie[] = data.data;
        const movieResponse = apiResponseMovie.filter(({ category }) => category == "Movies");
        if (movieResponse) {
          const moviePromise = Promise.all(
            movieResponse.map(async (elem) => {
              const { nameNormalize, movieResolution } = normalize_name_movie(elem.name);
              if (movieResolution) {
                const movieFormatted: Movie | undefined = await get_info_movie(nameNormalize, movieResolution, elem.torrent, elem.hash);
                return movieFormatted;
              }
            })
          );
          const movieFormatted = await moviePromise;
          const movieFiltered: Movie[] = movieFormatted.filter((obj) => obj != undefined) as Movie[];
          return movieFiltered;
        }
      }
    } catch (error) {
      return;
    }
  }
  const getMovieYtsSearch = async (query: string) => {
    const url = `https://yts.mx/api/v2/list_movies.json?&&query_term=${query}&sort=${sort}&order=${order}&page=${page}&limit=50`;
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
  };
  const requestExternalSourceSearch = async (query: string) => {
    let movieSearchFirstSource: Movie[] | undefined = await searchMovies(query);
    if (movieSearchFirstSource == undefined) {
      movieSearchFirstSource = [];
    }
    let movieSearchSecondSource: Movie[] | null = await getMovieYtsSearch(query);
    if (movieSearchSecondSource == null) {
      movieSearchSecondSource = [];
    }
    return filterSort(movieSearchFirstSource, movieSearchSecondSource);
  };

  const updateMoviesSearch = async (query: string) => {
    try {
      const res = await requestExternalSourceSearch(query);
      console.log(res);
      setMovies(res);
    } catch (error) {
      setMovies([]);
      console.log("cant get movies", error);
      return;
    }
  };
  useEffect(() => {
    if (querySearch) {
      updateMoviesSearch(querySearch);
    }
  }, [querySearch, filter, sort]);
  //  create here in the db or get
  return (
    <div className="flex  flex-row flex-wrap gap-5">
      {movies.map((movie, index) => {
        return <MovieCard key={index} movie={movie} movieSeen={movieSeen} />;
      })}
      {movies.length == 0 && !loading && <div> no result</div>}
      {movies.length == 0 && loading && <div> loading</div>}
    </div>
  );
}
