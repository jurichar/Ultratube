import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../../types";
import data from "../../utils/movies.json";
import dataTrending from "../../utils/trending.json";

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie>();

  useEffect(() => {
    if (id) {
      const movie = data.find((movie) => movie.id === id);
      setMovie(movie);

      if (!movie) {
        const movie = dataTrending.find((movie) => movie.id === id);
        setMovie(movie);
      }
    }
  }, [id]);

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="w-full h-40 text-quinary opacity-100 relative flex flex-col justify-center items-center">
        <div className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30 absolute" style={{ backgroundImage: `url(${movie?.image})` }}></div>
        <h1 className="text-4xl font-bold opacity-100">{movie?.title}</h1>
        <h2 className="text-2xl">{movie?.release}</h2>
      </div>
      <div className=" h-auto w-auto bg-secondary">
        <iframe height="390" width="765" src="https://moacloud.com/iframe/FavoXpQrbD" allowFullScreen></iframe>
      </div>
      {/* movie comments */}
      <div className="w-full h-1/4 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-white">Comments</h1>
      </div>
    </div>
  );
}
