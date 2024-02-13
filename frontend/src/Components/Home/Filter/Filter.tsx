import React, { useEffect, useState } from "react";
import InputGlobal from "../../Global/InputGlobal/InputGlobal";
import { FaStar } from "react-icons/fa";

type Genre = {
  id: number;
  name: string;
};
type filter = {
  rating: number;
  genre: string;
  min_year_release: number;
  duration: "all" | "u_60" | "60-120" | "a_120";
  name: string;
};
export default function Filter() {
  const [open, setOpen] = useState(false);
  const [genre, setGenre] = useState<Genre[]>([]);
  const [filter, setFilter] = useState<filter>({ rating: 7, genre: "all", min_year_release: 1900, duration: "all", name: "" });

  useEffect(() => {
    const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer  ${import.meta.env.VITE_TIMDB_ACCESS_KEY}`,
      },
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setGenre(json["genres"]))
      .catch((err) => console.error("error:" + err));
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = event.target;
    if (type == "number") {
      if (!isNaN(event.target.valueAsNumber)) {
        setFilter({ ...filter, [name]: event.target.valueAsNumber });
      }
    } else {
      setFilter({ ...filter, [name]: value });
    }
  }
  return (
    <div className="relative h-auto transition-all ">
      <button onClick={() => setOpen(!open)}> open filter</button>
      <div
        className={`${open ? "  opacity-100  h-auto" : "h-0   opacity-0"} transition-all
  ease-in
  duration-200  w-full h-full  bg-black  flex flex-col gap-8 rounded-md p-4 bg-tertiary `}
      >
        <div className="flex flex-col gap-4 ">
          <label htmlFor="rating" className="text-heading-sm flex gap-1">
            Choose minimum rating : {filter.rating} <FaStar />
          </label>
          <input id="rating" type="range" className="w-3/6" name="rating" onChange={handleChange} value={filter.rating} min={0} max={10} />
        </div>
        <div className="flex  flex-col gap-4">
          <label htmlFor="min-year" className="text-heading-sm">
            {" "}
            Choose your minimal release year
          </label>
          <InputGlobal handleChange={handleChange} name="min_year_release" value={filter.min_year_release} type="number" placeholder="Choose your minimal release year" />
        </div>
        <div className="flex  flex-col gap-4">
          <fieldset className="flex   flex-wrap gap-4">
            <legend className="text-heading-sm">Select your genre:</legend>
            <span className="border-2 pl-2 pr-4 border-white rounded-full flex gap-4">
              <input type="radio" id="all" name="genre" value="all" />
              <label htmlFor="all">all</label>
            </span>
            {genre.map((elem) => {
              return (
                <span key={elem.id} className="border-2 pl-2 pr-4 border-white rounded-full flex gap-4">
                  <input type="radio" id={elem.id.toString()} onChange={handleChange} name="genre" value={elem.name} />
                  <label htmlFor={elem.id.toString()}>{elem.name}</label>
                </span>
              );
            })}
          </fieldset>
        </div>
        <div className="">
          <InputGlobal handleChange={handleChange} name="name" value={filter.name} type="text" placeholder="filter by name :" />
        </div>
        <div className="flex flex-col gap-4">
          <fieldset className="flex gap-4">
            <legend> filter by duration</legend>
            <span className="border-2 pl-2 pr-4 border-white rounded-full">
              <input type="radio" id="all" name="duration" onChange={handleChange} value="all" checked={filter.duration == "all" ? true : false} />
              <label htmlFor="all"> all</label>
            </span>
            <span className="border-2 pl-2 pr-4 border-white rounded-full">
              <input type="radio" id="under-60" name="duration" onChange={handleChange} value="u_60" checked={filter.duration == "u_60" ? true : false} />
              <label htmlFor="under-60"> under 60 minutes</label>
            </span>
            <span className="border-2 pl-2 pr-4 border-white rounded-full">
              <input type="radio" id="60-120" name="duration" onChange={handleChange} value="60-120" checked={filter.duration == "60-120" ? true : false} />
              <label htmlFor="60-120"> 60 minutes to 120 minutes</label>
            </span>
            <span className="border-2 pl-2 pr-4 border-white rounded-full">
              <input type="radio" id="above_120" name="duration" onChange={handleChange} value="a_120" checked={filter.duration == "a_120" ? true : false} />
              <label htmlFor="above_120"> above 120 minutes</label>
            </span>
          </fieldset>
        </div>
        <div className="flex gap-4">
          <button> reset filter</button>
          <button> validate filter</button>
        </div>
      </div>
    </div>
  );
}
