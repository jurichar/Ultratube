// src/Components/MovieCards/MovieCardTrending.tsx

import BookmarkIcon from "./BookmarkIcon";
import { Movie } from "../../types";
import { useState } from "react";
import Loading from "../Loading/Loading";
import { FaStar } from "react-icons/fa";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCardTrending({ movie }: MovieCardProps) {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleMovieClick = () => {
    window.location.href = `/movie/${movie.id}`;
  };

  return (
    <div
      className="flex-shrink-0 w-60 h-32 rounded flex flex-col justify-between relative"
      style={{
        backgroundImage: `url(${movie.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {loading && <Loading />}
      <button className="z-10 opacity-0 w-full h-full bg-tertiary hover:opacity-50 rounded flex justify-center items-center transition-all" onClick={handleMovieClick}>
        Play
      </button>
      <BookmarkIcon />
      <div className="absolute left-2 bottom-2">
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
        <span className="text-quinary">{movie.title.length > 25 ? movie.title.slice(0, 25) + "..." : movie.title}</span>
        {movie.rating > 0.0 && (
          <div className="flex flex-row  items-center">
            {movie.rating} <FaStar />
          </div>
        )}
        <img src={movie.image} alt={movie.title} onLoad={handleImageLoad} onError={() => setLoading(false)} style={{ display: "none" }} />
      </div>
    </div>
  );
}
