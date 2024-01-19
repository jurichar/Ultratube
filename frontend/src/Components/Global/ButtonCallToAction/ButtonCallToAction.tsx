import React, { ReactNode, MouseEvent } from "react";

interface ButtonProps {
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  name: string;
  value: string;
  type: "submit" | "button";
  width: "sm" | "md";
  Icon: ReactNode;
}
export default function ButtonCallToAction({ handleClick, type = "button", value, name, width = "md", Icon }: ButtonProps) {
  return (
    <>
      {type == "submit" ? (
        <button onClick={handleClick} name={name} type={type} className={` w-full bg-secondary text-quinary rounded text-body-md font-custom  ${width == "md" ? "p-3.5" : "p-1"} `}>
          {value}
        </button>
      ) : (
        <button
          onClick={handleClick}
          name={name}
          type={type}
          className={` w-full  flex flex-col  gap-1 justify-center bg-secondary text-quinary rounded text-body-md font-custom  ${width == "md" ? "p-3.5" : "p-2"} `}
        >
          <h2>{value}</h2>
          <p className="self-center">{Icon}</p>
        </button>
      )}
    </>
  );
}
