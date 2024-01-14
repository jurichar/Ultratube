import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../../types";
import data from "../../utils/data_all.json";

export default function MoviePage() {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie>();

    useEffect(() => {
        if (id) {
            const movie = data.find((movie) => movie.id === id);
            setMovie(movie);
            console.log(movie);
        }
    }, [id]);

    return (
        <div className="w-full h-full bg-secondary p-4 flex flex-col items-center justify-around gap-6">
            {movie?.title}
        </div>
    );
}