import { schedule } from "node-cron";
import fs from "node:fs";

interface Movie {
  name: string;
  id: number;
  imdb_rating: number;
  production_year: number;
  duration: number;
  thumbnail_cover: string;
  comments_number: number;
  available_subtitles: any[];
  quality: string;
  language: string;
  imdb_code: string;
  torrent_hash: string;
  path: string;
}

interface WatchedMovie {
  movie: Movie;
  watched_at: string;
}

function isThirtyDaysPast(date: WatchedMovie): boolean {
  const passedLimit = new Date();
  passedLimit.setDate(passedLimit.getDate() - 30);
  const timestamp = new Date(date.watched_at);
  return timestamp <= passedLimit;
}

export function flushMoviesJob() {
  const job = schedule("*/1 * * * *", async () => {
    const response = await fetch("http://backend:8000/api/watched-movies/all/");
    const watchedMovieList: WatchedMovie[] = await response.json();

    const toFlush = watchedMovieList.filter(isThirtyDaysPast);
    for (const movie of toFlush) {
      fs.rm(
        movie.movie.path,
        { recursive: true, force: true },
        (err: Error) => {
          if (err) {
            throw err;
          }
          console.log(`${movie.movie.path} is deleted!`);
        },
      );
      // TODO update db path to blank
    }
    console.log("Running job: ", toFlush);
  });

  job.start();
}
