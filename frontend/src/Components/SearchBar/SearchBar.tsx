// src/Components/SearchBar/SearchBar.tsx

import { useEffect, useState } from "react";
import ButtonCallToAction from "../Global/ButtonCallToAction/ButtonCallToAction";
import { CiCoins1 } from "react-icons/ci";
import { Movie } from "../../types";
import MovieCard from "../MovieCards/MovieCard";

interface SearchBarProps {
  onSearch: (search: string) => void;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  showSearch: boolean;
}

const SearchBar = ({ onSearch, setShowSearch, showSearch }: SearchBarProps) => {
  const [search, setSearch] = useState("");
  const [submit, setSubmit] = useState(false);
  const [movieSearch, setMoviesSearch] = useState<Movie[]>([]);
  const [load, setLoad] = useState<boolean>(false);
  const arrayQuality = ["1080p", "720p"];
  // const Year = Array.from({ length: 2025 - 1888 }, (_, index) => index + 1888);
  // const regxYear = /\d{4}(?![a-zA-Z])/g;
  const regxYear = /(?:^|\D)(\d{4})(?:\D|$)/;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer  ${import.meta.env.VITE_TIMDB_ACCESS_KEY}`,
    },
  };

  const normalize_name_movie = (name: string) => {
    let index = name.indexOf("(");
    if (index == -1) {
      index = name.length;
    }
    const preFilteredName = name.slice(0, index);
    const indexQuality720p = preFilteredName.indexOf(arrayQuality[1]);
    const indexQuality1080p = preFilteredName.indexOf(arrayQuality[0]);
    let nameWIthoutQuality = preFilteredName;
    if (indexQuality720p > 0) {
      nameWIthoutQuality = preFilteredName.slice(0, indexQuality720p);
    } else if (indexQuality1080p > 0) {
      nameWIthoutQuality = preFilteredName.slice(0, indexQuality1080p);
    }
    let nameWithoutYear = nameWIthoutQuality;
    const matchYear = nameWIthoutQuality.match(regxYear);
    const matchRegx = matchYear ? matchYear[1] : "";
    if (matchYear) {
      const indexYear = nameWithoutYear.indexOf(matchRegx);
      if (indexYear > 0) {
        nameWithoutYear = nameWithoutYear.slice(0, indexYear);
      }
    }
    return nameWithoutYear;
  };
  const get_info_movie = async (name: string) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${name}`, options);
      const json = await response.json();
      if (json.results && json.results.length > 0) {
        const timdb_movie = json.results[0];
        const responseTmdb = await fetch(`https://api.themoviedb.org/3/movie/${timdb_movie.id}?append_to_response=videos&language=en-US`, options);
        const jsonTmdb = await responseTmdb.json();
        let trailer = "";
        if (jsonTmdb.videos && jsonTmdb.videos.results && jsonTmdb.videos.results.length > 0) {
          trailer = jsonTmdb.videos.results[0].key;
        }
        return {
          id: jsonTmdb.id,
          title: jsonTmdb.title,
          year: jsonTmdb.release_date,
          synopsis: jsonTmdb.overview,
          rating: jsonTmdb.vote_average,
          imdb_link: jsonTmdb.imdb_id,
          image: "https://media.themoviedb.org/t/p/w220_and_h330_face/" + jsonTmdb.poster_path,
          summary: "",
          genres: jsonTmdb?.genres?.map((user) => user.name),
          language: jsonTmdb.original_language,
          length: jsonTmdb.runtime,
          trailer: trailer,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function searchMovies() {
    try {
      setLoad(true);
      setMoviesSearch([]);
      const response = await fetch(`http://127.0.0.1:8009/api/v1/search?site=torlock&query=${search}`, { method: "GET" });
      const data = await response.json();
      // need to impletend type of data.data
      const movieResponse = data?.data?.filter(({ category }: string) => category == "Movies");
      if (movieResponse) {
        const moviePromise = Promise.all(
          movieResponse.map(async (elem) => {
            const nameNormalize = normalize_name_movie(elem.name);
            const movieFormatted: Movie | undefined = await get_info_movie(nameNormalize);
            if (movieFormatted && Object.keys(movieFormatted).length > 0) {
              movieFormatted.torrent = elem.torrent;
            }
            return movieFormatted;
          })
        );
        const movieFormatted = await moviePromise;
        const movieFiltered = movieFormatted.filter((obj) => obj != undefined);
        console.log(movieFiltered);
        setMoviesSearch(movieFiltered);
      }
      setLoad(false);
      setSubmit(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (search.length > 0 && submit) {
      searchMovies();
    }
  }, [submit, search]);

  useEffect(() => {
    return () => {
      setSearch("");
    };
  }, []);
  const cancelSearch = () => {
    setSearch("");
    setShowSearch(false);
  };
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="flex flex-row items-center w-full gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.31 12.9L17.71 16.29C17.8993 16.4778 18.0058 16.7334 18.0058 17C18.0058 17.2666 17.8993 17.5222 17.71 17.71C17.5222 17.8993 17.2666 18.0058 17 18.0058C16.7334 18.0058 16.4778 17.8993 16.29 17.71L12.9 14.31C11.5025 15.407 9.77666 16.0022 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16.0022 9.77666 15.407 11.5025 14.31 12.9ZM8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z"
            fill="white"
          />
        </svg>
        <input
          className="bg-primary text-quaternary px-4 py-2 rounded w-full"
          placeholder="Search for movies or TV series"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearch(e.target.value);
          }}
        />
        <div className="w-fit">
          <ButtonCallToAction
            handleClick={() => {
              setSubmit(true);
              setShowSearch(true);
            }}
            type="button"
            value="search"
            name="search"
          />
        </div>
      </div>
      {load && <div> loading</div>}
      {showSearch && !load && (
        <div>
          <div>
            <ButtonCallToAction handleClick={cancelSearch} type="button" value="cancel search" name="cancel search" />
            search result
          </div>
          {movieSearch.map((movie, index) => {
            return <MovieCard key={index} movie={movie} />;
          })}
          {movieSearch.length == 0 && <div> no result</div>}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
