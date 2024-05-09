import { MouseEvent } from "react";
import { useTranslation } from "react-i18next";

interface ButtonProps {
  handleClick: (event: MouseEvent<HTMLButtonElement>, name: string) => void;
  name: string;
  value: string;
  type: "submit" | "button";
}
export default function ButtonCallToAction({ handleClick, type = "button", value, name }: ButtonProps) {
  const { t } = useTranslation();
  return (
    <button onClick={(event) => handleClick(event, name)} id={name} type={type} className="w-full bg-secondary text-quinary rounded text-body-md font-custom p-1 m-2">
      {t(value)}
    </button>
  );
}
