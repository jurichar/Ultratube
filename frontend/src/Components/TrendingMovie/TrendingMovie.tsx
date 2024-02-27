import { useEffect, useState } from "react";
import { Movie } from "../../types";
import MovieCardTrending from "../MovieCards/MovieCardTrending";

type YtsMovie = {
  id: string;
  title: string;
  year: number;
  medium_cover_image: string;
  synopsis: string;
  rating: number;
  imdb_code: string;
  summary?: string;
  language: string;
  yt_trailer_code?: string;
  genres: Array<string>;
  runtime: number;
  torrent?: string;
};
export default function TrendingMovie() {
  const [moviesTrending, setMoviesTrending] = useState<Movie[]>([]);

  async function get_trending_movie() {
    try {
      const all_movies_res = await fetch(`https://yts.mx/api/v2/list_movies.json?sort=seed&page=1`, { method: "GET" });
      const all_movies_json = await all_movies_res.json();
      if ("movies" in all_movies_json.data) {
        const all_Movie_Data: YtsMovie[] = all_movies_json.data.movies;
        const arrayTrending = all_Movie_Data.map((elem) => {
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
