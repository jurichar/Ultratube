import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Movie, crewUser } from "../../types";
import MemberMovie from "./MemberMovie/MemberMovie";
import TrailerSection from "../Global/TrailerSection/TrailerSection";
import Comments from "./Comments";
import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import { notify } from "../../utils/notifyToast";
import { useAuth } from "../../context/useAuth";
import WebTorrent from "webtorrent/dist/webtorrent.min.js";
// import WebTorrent from "https://esm.sh/webtorrent";

export default function MoviePage() {
  const { state } = useLocation();
  const [movie, setMovie] = useState<Movie>();
  const [crew, setCrew] = useState<crewUser[]>();
  const [cast, setCast] = useState<crewUser[]>();
  const [movieIdDb, setMovieIdDb] = useState<number>(0);
  const { languageSelected } = useAuth();
  const options = useMemo(
    () => ({
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer  ${import.meta.env.VITE_TIMDB_ACCESS_KEY}`,
      },
    }),
    []
  );
  const [torrentId, setTorrentId] = useState(
    "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent"
  );

  const [videoUrl, setVideoUrl] = useState(""); // Video URL for streaming

  useEffect(() => {
    const client = new WebTorrent();

    client.on("error", (err) => {
      console.error("WebTorrent error:", err);
    });

    client.on("torrent", (torrent) => {
      console.log("Torrent downloading:", torrent.name);

      const file = torrent.files.find((file) => file.name.endsWith(".mp4"));

      if (file) {
        let videoBlob = null;
        const chunks = [];

        file
          .createReadStream()
          .on("data", (chunk) => {
            chunks.push(chunk);
          })
          .on("end", () => {
            videoBlob = new Blob(chunks, { type: "video/mp4" });
            // with real stream from the back i need to fetch the url and get a .blob to create a object url and  show in
            const videoBlobUrl = URL.createObjectURL(videoBlob);
            setVideoUrl(videoBlobUrl);
          });
      }
    });

    client.add(torrentId);

    return () => {
      client.destroy();
    };
  }, [torrentId]);

  useEffect(() => {
    async function createMovieInDb() {
      const dataObject = {
        name: movie?.title,
        thumbnail_cover: movie?.image,
        imdb_rating: movie?.rating,
        production_year: movie?.year,
        duration: movie?.length,
        quality: movie?.quality,
        language: movie?.language,
        torrent: movie?.torrent,
      };
      try {
        const result: { id: number } = await fetchWrapper("api/movies/create_movie/", { method: "POST", body: dataObject });
        setMovieIdDb(result.id);
      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        notify({ type: "error", msg: message });
      }
    }
    if (movie && Object.keys(movie).length > 0) {
      createMovieInDb();
    }
  }, [movie]);

  async function getInfoMovie(title: string, year: number, torrent: string, quality: string, language: string, image: string, trailer: string, length: number, genres: string[]) {
    const movieInfoTmp: Movie = { rating: 0, synopsis: "", year: year, title: title, torrent, quality, language, image, trailer, length, genres };
    const url = `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&language=${languageSelected}&page=1&append_to_response=credits`;
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if ("results" in json && json["results"] && json["results"].length > 0) {
        const movieData = json["results"][0];
        movieInfoTmp.synopsis = movieData.overview;
        movieInfoTmp.rating = movieData.vote_average;
        const urlInfo = `https://api.themoviedb.org/3/movie/${movieData.id}?append_to_response=credits%2Cvideos&language=${languageSelected}`;
        const responseInfo = await fetch(urlInfo, options);
        const movieInfo = await responseInfo.json();
        if (movieInfo && Object.keys(movieInfo).length > 0) {
          setMovie(movieInfoTmp);
          if ("credits" in movieInfo && "cast" in movieInfo["credits"]) {
            const cast = movieInfo["credits"]["cast"].map((elem: crewUser) => {
              return {
                character: elem.character,
                known_for_department: elem.known_for_department,
                name: elem.name,
                profile_path: elem.profile_path && "https://image.tmdb.org/t/p/w138_and_h175_face/" + elem.profile_path,
              };
            });
            setCast(cast);
          }
          if ("credits" in movieInfo && "crew" in movieInfo["credits"]) {
            const crew = movieInfo["credits"]["crew"].map((elem: crewUser) => {
              return {
                character: "",
                known_for_department: elem?.known_for_department,
                name: elem.name,
                profile_path: elem.profile_path && "https://image.tmdb.org/t/p/w138_and_h175_face/" + elem.profile_path,
              };
            });
            setCrew(crew);
          }
        }
      }
    } catch (error) {
      notify({ type: "error", msg: "cant get info for this movie" });
    }
  }

  useEffect(() => {
    const { movieProps } = state;
    // check if all key is present
    if ("title" in movieProps && movieProps["title"] && movieProps["title"].length > 0) {
      const { title, year, torrent, quality, language, image, trailer, length, genres } = movieProps;
      getInfoMovie(title, year, torrent, quality, language, image, trailer, length, genres);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="flex flex-col  gap-20 justify-center items-center ">
      <div className="w-full h-40 text-quinary opacity-100 relative flex flex-col justify-center items-center">
        <div className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30 absolute" style={{ backgroundImage: `url(${movie?.image})` }}></div>
        <h1 className="text-4xl font-bold opacity-100">{movie?.title}</h1>
        <h2 className="text-2xl">{movie?.year}</h2>
        {movie && movie?.rating > 0.0 && <h3>imb rating : {movie?.rating} /10 </h3>}
        <h3> {movie?.length} minutes</h3>
      </div>
      {movie?.summary ? (
        <div className="w-8/12 flex flex-col  gap-6 justify-center items-center">
          <h1 className="text-4xl font-bold text-white">Summary</h1>
          <span className="text-white text-center">{movie?.summary}</span>
        </div>
      ) : (
        movie?.synopsis && (
          <div className="w-8/12 flex flex-col  gap-6 justify-center items-center">
            <h1 className="text-4xl font-bold text-white">Synopsis</h1>
            <span className="text-white text-center">{movie?.synopsis}</span>
          </div>
        )
      )}
      {movie?.trailer && <TrailerSection linkEmbed={movie.trailer} />}
      {videoUrl && (
        <video controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <h1 className="text-4xl font-bold text-white">Movie</h1>
      <div className="w-10/12 h-auto  bg-secondary">{/* <ifrae className="w-full aspect-video" src="https://moacloud.com/iframe/FavoXpQrbD" allowFullScreen></ifrae> */}</div>
      <h4 className="text-quinary"> genres : {movie?.genres?.join(",")}</h4>
      <MemberMovie crew={crew} cast={cast} />
      <Comments movieId={movieIdDb} />
    </div>
  );
}
