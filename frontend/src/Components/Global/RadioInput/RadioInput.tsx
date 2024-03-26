import { objectFilter } from "../../../types";
import React from "react";

type RadioInput = {
  value: string;
  legend: string;
  name: string;
  array: objectFilter[];
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function RadioInput(props: RadioInput) {
  const { value, array, handleChange, legend, name } = props;

  return (
    <fieldset className="flex   flex-wrap gap-4">
      <legend className="text-heading-sm">{legend}</legend>
      <span className="border-2 pl-2 pr-4 border-white rounded-full flex gap-4">
        <input type="radio" id="all" name={name} value="all" onChange={handleChange} checked={value == "all"} />
        <label htmlFor="all">all</label>
      </span>
      {array.map((elem) => {
        return (
          <span key={elem.id} className="border-2 pl-2 pr-4 border-white rounded-full flex gap-4">
            <input type="radio" id={elem.id.toString()} onChange={handleChange} name={name} value={elem.name} checked={value == elem.name} />
            <label htmlFor={elem.id.toString()}>{name == "duration" ? elem.placeholder : elem.name}</label>
          </span>
        );
      })}
    </fieldset>
  );
}
