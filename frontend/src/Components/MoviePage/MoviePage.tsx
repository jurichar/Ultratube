import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Movie, crewUser } from "../../types";
import MemberMovie from "./MemberMovie/MemberMovie";
import CommentSection from "./CommentSection/CommentSection";
import TrailerSection from "../Global/TrailerSection/TrailerSection";

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const [movie, setMovie] = useState<Movie>();
  const [crew, setCrew] = useState<crewUser[]>();
  const [cast, setCast] = useState<crewUser[]>();

  async function getImdb_info(link: string) {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer  ${import.meta.env.VITE_TIMDB_ACCESS_KEY}`,
      },
    };
    fetch(`https://api.themoviedb.org/3/find/${link}?external_source=imdb_id`, options)
      .then((res) => res.json())
      .then((json) => {
        if ("movie_results" in json && json["movie_results"].length > 0) {
          if ("id" in json["movie_results"][0]) {
            const id_timdb = json["movie_results"][0].id;
            fetch(`https://api.themoviedb.org/3/movie/${id_timdb}?append_to_response=credits&language=en-US`, options)
              .then((res) => res.json())
              .then((json) => {
                if ("credits" in json && "cast" in json["credits"]) {
                  const cast = json["credits"]["cast"].map((elem: crewUser) => {
                    return {
                      character: elem.character,
                      known_for_department: elem.known_for_department,
                      name: elem.name,
                      profile_path: elem.profile_path && "https://image.tmdb.org/t/p/w138_and_h175_face/" + elem.profile_path,
                    };
                  });
                  setCast(cast);
                }
                if ("credits" in json && "crew" in json["credits"]) {
                  const crew = json["credits"]["crew"].map((elem: crewUser) => {
                    return {
                      character: "",
                      known_for_department: elem?.known_for_department,
                      name: elem.name,
                      profile_path: elem.profile_path && "https://image.tmdb.org/t/p/w138_and_h175_face/" + elem.profile_path,
                    };
                  });
                  setCrew(crew);
                }
              })
              .catch((err) => console.error("error:" + err));
          }
        }
      })
      .catch((err) => console.error("error:" + err));
  }
  useEffect(() => {
    if (id) {
      const { movie } = state;
      if (movie?.imdb_link) {
        getImdb_info(movie.imdb_link);
      }
      setMovie(movie);
    }
    return () => {
      setMovie(undefined);
      setCrew(undefined);
    };
  }, [id, state]);

  return (
    <div className="flex flex-col  gap-20 justify-center items-center ">
      <div className="w-full h-40 text-quinary opacity-100 relative flex flex-col justify-center items-center">
        <div className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30 absolute" style={{ backgroundImage: `url(${movie?.image})` }}></div>
        <h1 className="text-4xl font-bold opacity-100">{movie?.title}</h1>
        <h2 className="text-2xl">{movie?.release}</h2>
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

      <h1 className="text-4xl font-bold text-white">Movie</h1>
      <div className="w-10/12 h-auto  bg-secondary">
        <iframe className="w-full aspect-video" src="https://moacloud.com/iframe/FavoXpQrbD" allowFullScreen></iframe>
      </div>
      <h4 className="text-quinary"> genres : {movie?.genres?.join(",")}</h4>
      <MemberMovie crew={crew} cast={cast} />
      <CommentSection />
    </div>
  );
}
