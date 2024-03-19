import { useEffect, useState } from "react";
import { Movie, YtsMovie } from "../../types";
import MovieCardTrending from "../MovieCards/MovieCardTrending";

export default function TrendingMovie() {
  const [moviesTrending, setMoviesTrending] = useState<Movie[]>([]);

  async function get_trending_movie() {
    try {
      const all_movies_res = await fetch(`https://yts.mx/api/v2/list_movies.json?sort=seed&page=1`, { method: "GET" });
      const all_movies_json = await all_movies_res.json();
      if ("movies" in all_movies_json.data) {
        const all_Movie_Data: YtsMovie[] = all_movies_json.data.movies;
        const arrayTrending = all_Movie_Data.map((elem) => {
          const quality = Array.isArray(elem.torrents) && elem.torrents?.length > 0 ? elem.torrents[0].quality : elem.torrents.quality;
          const torrent_url = Array.isArray(elem.torrents) && elem.torrents?.length > 0 ? elem.torrents[0].url : elem.torrents.url;
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
          };
        });
        setMoviesTrending(arrayTrending);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    get_trending_movie();
    return () => {
      setMoviesTrending([]);
    };
  }, []);
  return (
    <div className="w-full h-full flex flex-col gap-4 ">
      <span>Trending</span>
      <div className="overflow-x-auto w-full flex flex-row gap-4">
        {moviesTrending.map((movie) => (
          <MovieCardTrending key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
