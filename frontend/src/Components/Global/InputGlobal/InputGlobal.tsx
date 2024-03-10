import { ChangeEvent } from "react";
interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string | number;
  placeholder: string;
  type: string;
}
export default function InputGlobal({ handleChange, name, value, placeholder, type }: Props) {
  return (
    <div className="relative w-full">
      <input
        name={name}
        onChange={handleChange}
        type={type}
        value={value}
        placeholder={placeholder}
        className="relative w-full pl-2 h-9  text-quinary border-gray-400 border-b-2 outline-none  hover:border-cyan-50 hover:placeholder:text-white focus:border-cyan-100 transition-all tra bg-transparent"
      />
    </div>
  );
}
