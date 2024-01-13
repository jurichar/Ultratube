// frontend/src/Components/Home/Home.tsx

import MovieCard from "../MovieCards/MovieCard";
import MovieCardTrending from "../MovieCards/MovieCardTrending";
import SearchBar from "../SearchBar/SearchBar";


export default function Home() {
  return (
    <div className="w-full h-max text-quinary p-4 flex flex-col items-center justify-around gap-6">
      <SearchBar />
      <div className="w-full h-full flex flex-col gap-4 ">
        <span>Trending</span>
        <div className="overflow-x-auto w-full flex flex-row gap-4">
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
        </div>
      </div >
      <div className="w-full h-full flex flex-col gap-4 ">
        <span>Recommended for you</span>
        <div className="flex flex-row flex-wrap gap-5">
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
        </div>
      </div>
    </div >
  );
}
