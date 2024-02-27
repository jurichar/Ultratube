import { Movie } from "../../../types";

type SortProps = {
  sort: keyof Movie;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};
export default function SortMovie(props: SortProps) {
  const { sort, handleChange } = props;

  return (
    <select
      id="sort"
      value={sort}
      className="bg-gray-50 border  w-fit  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      onChange={handleChange}
    >
      <option value="" selected>
        sort by
      </option>
      <option value="rating">imdb rating</option>
      <option value="title">title</option>
      {/* <option value="genre">genre</option> */}
      <option value="length"> duration</option>
      <option value="year"> production year</option>
    </select>
  );
}
