// frontend/src/Components/Home/Home.tsx

import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Movie, Order, filter } from "../../types";
import RecommendedMovie from "./RecommendedMovie/RecommendedMovie";
import SearchResult from "../SearchResult/SearchResult";
import Filter from "./Filter/Filter";
import SortMovie from "./SortMovie/SortMovie";
import TrendingMovie from "../TrendingMovie/TrendingMovie";
import { useAuth } from "../../context/useAuth";
import { useTranslation } from "react-i18next";
import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import { notify } from "../../utils/notifyToast";

export default function Home() {
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const initialState = { rating: 0, genre: "all", min_year_release: 1900, duration: "all", name: "", genre_en: "all" };
  const [filter, setFilter] = useState<filter>(initialState);
  const [sort, setSort] = useState<keyof Movie>("rating");
  const [order, setOrder] = useState<Order>("asc");
  const [moviesSeen, setMoviesSeen] = useState<[{ movie: Movie }]>();
  const { languageSelected, userData } = useAuth();
  async function handleSearch(search: string) {
    setPage(1);
    setSort("title");
    setOrder("asc");
    setSearchQuery(search);
  }

  useEffect(() => {
    if (userData) {
      getListSeenMovie();
    }
  }, [userData]);
  async function getListSeenMovie() {
    try {
      const res: [{ movie: Movie }] = await fetchWrapper("api/watched-movies/", { method: "GET" });
      setMoviesSeen(res);
    } catch (error) {
      notify({ type: "warning", msg: "cant get list watched movie" });
    }
  }
  const filterSort = (currentMovie: Movie[], arrayMovie: Movie[]) => {
    const array = [...currentMovie, ...arrayMovie];
    const filtered_movies = filteredArray(array);
    const sorted_movies = sortArray(sort, filtered_movies);
    const duplicateMovies = [...new Map(sorted_movies.map((movie) => [movie.id, movie])).values()];
    return duplicateMovies;
  };

  /** FILTER AND SORT UTILS */
  const filteredArray = (arrayMovie: Movie[]) => {
    let tmpArrayMovie = arrayMovie;
    tmpArrayMovie = tmpArrayMovie.filter(({ rating }) => rating >= filter.rating);
    tmpArrayMovie = tmpArrayMovie.filter(({ year }) => year >= filter.min_year_release);
    if (filter.name != "") {
      tmpArrayMovie = tmpArrayMovie.filter(({ title }) => title.includes(filter.name));
    }
    if (filter.genre != "all") {
      tmpArrayMovie = tmpArrayMovie.filter(({ genres }) => genres?.includes(filter.genre));
    }
    if (filter.duration != "all") {
      if (filter.duration == "u_60") {
        tmpArrayMovie = tmpArrayMovie.filter(({ length }) => length <= 60);
      } else if (filter.duration == "60-120") {
        tmpArrayMovie = tmpArrayMovie.filter(({ length }) => {
          if (length >= 60 && length <= 120) {
            return true;
          } else {
            return false;
          }
        });
      } else if (filter.duration == "a_120") {
        tmpArrayMovie = tmpArrayMovie.filter(({ length }) => length >= 120);
      }
    }
    return tmpArrayMovie;
  };

  function handleSubmitFilter(filterObject: filter) {
    setPage(1);
    setFilter(filterObject);
  }

  const sortArray = (value: keyof Movie, array: Movie[]) => {
    let movieTmp = structuredClone(array);
    if (value == "genres") {
      movieTmp = movieTmp.sort((firstItem, secondItem) => {
        let valueFirstItem;
        let valueSecondItem;
        if (firstItem[value] && firstItem[value].length > 0 && secondItem[value] && secondItem[value].length > 0) {
          valueFirstItem = firstItem[value][0];
          valueSecondItem = secondItem[value][0];
        }
        if (valueFirstItem && valueSecondItem) {
          if (order == "asc") {
            if (valueFirstItem > valueSecondItem) {
              return 1;
            } else {
              return -1;
            }
          } else {
            if (valueFirstItem < valueSecondItem) {
              return 1;
            } else {
              return -1;
            }
          }
        } else {
          return 0;
        }
      });
    } else {
      movieTmp = movieTmp.sort((firstItem, secondItem) => {
        const valueFirstItem = firstItem[value];
        const valueSecondItem = secondItem[value];
        if (valueFirstItem != undefined && valueSecondItem != undefined) {
          if (order == "asc") {
            if (valueFirstItem >= valueSecondItem) {
              return 1;
            } else {
              return -1;
            }
          } else {
            if (valueFirstItem <= valueSecondItem) {
              return 1;
            } else {
              return -1;
            }
          }
        } else {
          return 0;
        }
      });
    }
    return movieTmp;
  };

  function handleSort(event: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;
    const valueCast = value as keyof Movie;
    setSort(valueCast);
  }

  useEffect(() => {
    setPage(1);
  }, [languageSelected]);
  /*** INFINITE SCROLL */
  useEffect(() => {
    function watchScroll() {
      window.addEventListener(
        "scroll",
        function () {
          handleScrollInfinite();
        },
        false
      );
    }
    watchScroll();
    return () => {
      document.removeEventListener("scroll", handleScrollInfinite);
    };
  }, []);
  /***  UTILS INFINITE SCROLL */
  function handleScrollInfinite() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage((prev) => prev + 1);
    }
  }

  return (
    <div className="w-full h-max text-quinary p-4 flex flex-col items-center justify-around gap-6 md:p-0 md:pt-4 ">
      <SearchBar onSearch={handleSearch} setShowSearch={setShowSearch} showSearch={showSearch} setPage={setPage} />
      {!showSearch && <TrendingMovie moviesSeen={moviesSeen} />}
      <div className="w-full h-full flex pb-60 flex-col gap-4 relative">
        <span className="w-full flex gap-4 items-center text-heading-md">{showSearch ? `${t("search")} : ${searchQuery}` : t("recommended")}</span>
        <div className="flex flex-row gap-4">
          <SortMovie sort={sort} handleChange={handleSort} />
          <select
            id="way-sort"
            value={order}
            className="bg-gray-50 border  w-fit  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(event) => setOrder(event?.target?.value as Order)}
          >
            <option value="asc">ascendent</option>
            <option value="desc"> descendent</option>
          </select>
        </div>
        <Filter initialState={initialState} handleSubmitFilter={handleSubmitFilter} />
        {!showSearch && <RecommendedMovie order={order} moviesSeen={moviesSeen} filter={filter} page={page} sort={sort} filterSort={filterSort} />}
        {showSearch && <SearchResult showSearch={showSearch} movieSeen={moviesSeen} querySearch={searchQuery} filter={filter} sort={sort} filterSort={filterSort} order={order} page={page} />}
      </div>
    </div>
  );
}
