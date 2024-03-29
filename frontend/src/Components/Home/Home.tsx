// frontend/src/Components/Home/Home.tsx

import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Movie, Order, filter } from "../../types";
import RecommendedMovie from "./RecommendedMovie/RecommendedMovie";
import SearchResult from "../SearchResult/SearchResult";
import Filter from "./Filter/Filter";
import SortMovie from "./SortMovie/SortMovie";
import TrendingMovie from "../TrendingMovie/TrendingMovie";
// import { useTranslation } from "react-i18next";

export default function Home() {
  // const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const initialState = { rating: 0, genre: "all", min_year_release: 1900, duration: "all", name: "" };
  const [filter, setFilter] = useState<filter>(initialState);
  const [sort, setSort] = useState<keyof Movie>("rating");
  const [order, setOrder] = useState<Order>("asc");

  async function handleSearch(search: string) {
    setPage(1);
    setSort("title");
    setOrder("asc");
    setSearchQuery(search);
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
    if (filter.name != "") {
      tmpArrayMovie = tmpArrayMovie.filter(({ title }) => title.includes(filter.name));
    }
    if (filter.genre != "all") {
      tmpArrayMovie = tmpArrayMovie.filter(({ genres }) => genres.includes(filter.genre));
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
    movieTmp = movieTmp.sort((firstItem, secondItem) => {
      const valueFirstItem = firstItem[value];
      const valueSecondItem = secondItem[value];
      const orderAsc = order == "asc" && valueFirstItem && valueSecondItem && valueFirstItem > valueSecondItem;
      const orderDesc = order == "desc" && valueFirstItem && valueSecondItem && valueFirstItem < valueSecondItem;
      if (order == "desc" ? orderDesc : orderAsc) {
        return 1;
      } else if (valueFirstItem && valueSecondItem && valueFirstItem == valueSecondItem) {
        return -0;
      } else {
        return -1;
      }
    });
    return movieTmp;
  };

  function handleSort(event: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;
    const valueCast = value as keyof Movie;
    setSort(valueCast);
  }
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
      {!showSearch && <TrendingMovie />}
      <div className="w-full h-full flex pb-60 flex-col gap-4 relative">
        <span className="w-full flex gap-4 items-center text-heading-md">{showSearch ? `Search : ${searchQuery} ` : "Recommended for you"}</span>
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
        {!showSearch && <RecommendedMovie order={order} filter={filter} page={page} sort={sort} filterSort={filterSort} />}
        {showSearch && <SearchResult showSearch={showSearch} querySearch={searchQuery} filter={filter} sort={sort} filterSort={filterSort} order={order} page={page} />}
      </div>
    </div>
  );
}
