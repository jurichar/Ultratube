// src/Components/MovieCards/MovieCard.tsx

import { Movie } from "../../types";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/notifyToast";
interface MovieCardProps {
  movie: Movie;
  idMovie?: number;
  movieSeen?: [{ movie: Movie }];
}

export default function MovieCard({ movie, movieSeen }: MovieCardProps) {
  const [loading, setLoading] = useState(true);
  const [watch, setWatch] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleImageLoad = () => {
    setLoading(false);
  };
  const handleMovieClick = async () => {
    try {
      navigate(`/movie/${movie.id}`, { state: { movieProps: movie } });
    } catch (error) {
      notify({ type: "error", msg: " cant access to this movie please retry" });
    }
  };
  useEffect(() => {
    if (movieSeen && movieSeen?.length > 0) {
      movieSeen.forEach((elem) => {
        const movieToCompare: Movie = elem.movie;
        if (movieToCompare.imdb_code == movie.imdb_link) {
          setWatch(true);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieSeen]);

  return (
    <div className="flex flex-col">
      <div
        className={`flex-shrink-0 mb-2 w-40 h-28 flex justify-end rounded relative ${watch ? "border-2 border-red-500 opacity-30" : ""}`}
        style={{
          backgroundImage: `url(${movie.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {loading && <Loading />}
        <button className="transition-all z-10 opacity-0 w-full h-full bg-tertiary hover:opacity-50 rounded flex justify-center items-center" onClick={handleMovieClick}>
          {watch ? "re watch" : "Play"}
        </button>
      </div>
      <div className="flex flex-row items-center gap-2">
        <span className="text-quinary text-xs">{movie.year}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            opacity="0.75"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.47778 0H1.52222C0.681522 0 0 0.681522 0 1.52222V8.47778C0 9.31848 0.681522 10 1.52222 10H8.47778C8.8815 10 9.26868 9.83962 9.55415 9.55415C9.83962 9.26868 10 8.8815 10 8.47778V1.52222C10 1.1185 9.83962 0.731321 9.55415 0.445849C9.26868 0.160377 8.8815 0 8.47778 0ZM2 4.5H1V3.5H2V4.5ZM2 5.5H1V6.5H2V5.5ZM9 4.5H8V3.5H9V4.5ZM9 5.5H8V6.5H9V5.5ZM9 1.37V2H8V1H8.63C8.72813 1 8.82224 1.03898 8.89163 1.10837C8.96102 1.17776 9 1.27187 9 1.37ZM2 1H1.37C1.27187 1 1.17776 1.03898 1.10837 1.10837C1.03898 1.17776 1 1.27187 1 1.37V2H2V1ZM1 8.63V8H2V9H1.37C1.27187 9 1.17776 8.96102 1.10837 8.89163C1.03898 8.82224 1 8.72813 1 8.63ZM8.63 9C8.83435 9 9 8.83435 9 8.63V8H8V9H8.63Z"
            fill="white"
          />
        </svg>
        <span className="text-quaternary text-xs ">Movie</span>
        <span className="text-quinary text-xs">{movie.length}min</span>
      </div>
      <span className="text-quinary">{movie.title.length > 14 ? movie.title.slice(0, 14) + "..." : movie.title}</span>
      <h3> {movie?.language}</h3>
      <h3> {movie?.quality}</h3>
      {movie.rating > 0.0 && (
        <div className="flex flex-row  items-center">
          {movie.rating} <FaStar />
        </div>
      )}
      <img src={movie.image} alt={movie.title} onLoad={handleImageLoad} style={{ display: "none" }} />
    </div>
  );
}
