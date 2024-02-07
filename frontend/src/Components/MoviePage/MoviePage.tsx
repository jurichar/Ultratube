import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../../types";
import moviesData from "../../utils/movies.json";
import trendingData from "../../utils/trending.json";
import Comments from "./Comments";

export default function MoviePage() {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | undefined>();

    useEffect(() => {
        let _movie = moviesData.find((movie) => movie.id === id);
        if (!_movie) {
            _movie = trendingData.find((movie) => movie.id === id);
        }
        if (_movie) {
            setMovie(_movie);
        }
        else {
            console.log("Movie not found");
        }
    }, [id]);

    return (
        <div className="flex flex-col justify-center items-center gap-4 md:pl-9">
            <div className="w-full text-quinary opacity-100 relative flex flex-col justify-center items-center">
                <div className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30 absolute" style={{ backgroundImage: `url(${movie?.image})` }}>
                </div>
                <h1 className="text-heading-lg font-bold opacity-100 p-4">{movie?.title}</h1>
                <h2 className="text-heading-md p-4">{movie?.release}</h2>
            </div>
            <div className="w-full h-auto flex flex-col justify-center items-center p-4">
                <p className="text-quaternary text-lg">{movie?.synopsis}</p>
            </div>
            <div className="w-full aspect-video bg-secondary">
                <iframe
                    src={`https://moacloud.com/iframe/FavoXpQrbD`}
                    title="movie"
                    width="100%"
                    height="100%"
                    allowFullScreen
                ></iframe>
            </div>
            <Comments movieId={movie?.id} />
        </div >
    );
}