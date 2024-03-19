import React, { useEffect, useState } from "react";
import InputGlobal from "../../Global/InputGlobal/InputGlobal";
import { FaStar } from "react-icons/fa";
import ButtonCallToAction from "../../Global/ButtonCallToAction/ButtonCallToAction";
import RadioInput from "../../Global/RadioInput/RadioInput";
import { objectFilter, filter } from "../../../types";
import { useAuth } from "../../../context/useAuth";
import { notify } from "../../../utils/notifyToast";

type filterProps = {
  initialState: filter;
  handleSubmitFilter: (filter: filter) => void;
};
export default function Filter(props: filterProps) {
  const { initialState, handleSubmitFilter } = props;
  const [filter, setFilter] = useState<filter>(initialState);
  const [open, setOpen] = useState(false);
  const [genre, setGenre] = useState<objectFilter[]>([]);
  const [genreEn, setGenreEn] = useState<objectFilter[]>([]);
  const { languageSelected } = useAuth();
  function handleFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = event.target;
    if (name == "genre") {
      console.log(value, genreEn, genre);
      if (value == "all") {
        setFilter({ ...filter, ["genre_en"]: value, ["genre"]: value });
      } else {
        setFilter({ ...filter, ["genre_en"]: genreEn[genre.findIndex(({ name }) => name == value)].name, ["genre"]: value });
      }
      return;
    }
    if (type == "number") {
      if (!isNaN(event.target.valueAsNumber)) {
        setFilter({ ...filter, [name]: event.target.valueAsNumber });
      }
    } else {
      setFilter({ ...filter, [name]: value });
    }
  }
  function handleDeleteFilter() {
    setFilter(initialState);
    handleSubmitFilter(initialState);
  }
  const arrayDuration: objectFilter[] = [
    { id: 37373737, name: "u_60", placeholder: "under 60 minutes" },
    { id: 3788787, name: "60-120", placeholder: " 60 minutes to 120 minutes" },
    { id: 336366363535, name: "a_120", placeholder: "above 120 minutes" },
  ];

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=${languageSelected}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer  ${import.meta.env.VITE_TIMDB_ACCESS_KEY}`,
      },
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        setFilter(initialState);
        setGenre(json["genres"]);
      })
      .catch(() => notify({ type: "warning", msg: "error on api tmdb" }));
  }, [initialState, languageSelected]);

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer  ${import.meta.env.VITE_TIMDB_ACCESS_KEY}`,
      },
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setGenreEn(json["genres"]))
      .catch((err) => console.error("error:" + err));
  }, []);
  return (
    <div className="h-fit transition-all ">
      <button onClick={() => setOpen(!open)}> open filter</button>
      <div
        className={`${open ? "opacity-100  h-3/5" : "h-0   opacity-0"} transition-all
  ease-in-out
  duration-200  transition[height] ease-linear duration-300 w-full    flex flex-col gap-8 rounded-md p-4 bg-tertiary `}
      >
        <div className="flex flex-col gap-4 ">
          <label htmlFor="rating" className="text-heading-sm flex gap-1">
            Choose minimum rating : {filter.rating} <FaStar />
          </label>
          <input id="rating" type="range" className="w-3/6" name="rating" onChange={handleFilter} value={filter.rating} min={0} max={9} />
        </div>
        <div className="flex  flex-col gap-4">
          <label htmlFor="min-year" className="text-heading-sm">
            Choose your minimal release year
          </label>
          <InputGlobal handleChange={handleFilter} name="min_year_release" value={filter.min_year_release} type="number" placeholder="Choose your minimal release year" />
        </div>
        <RadioInput handleChange={handleFilter} legend="Select your genre:" array={genre} value={filter.genre} name="genre" />
        <InputGlobal handleChange={handleFilter} name="name" value={filter.name} type="text" placeholder="filter by name :" />
        <RadioInput handleChange={handleFilter} legend="filter by duration" value={filter.duration} name="duration" array={arrayDuration} />
        <div className="flex w-2/6 gap-4">
          <ButtonCallToAction handleClick={handleDeleteFilter} type="button" name="reset" value="reset filter" />
          <ButtonCallToAction handleClick={() => setOpen(false)} type="button" name="close" value="close filter" />
          <ButtonCallToAction handleClick={() => handleSubmitFilter(filter)} type="button" name="submit" value="submit filter" />
        </div>
      </div>
    </div>
  );
}
