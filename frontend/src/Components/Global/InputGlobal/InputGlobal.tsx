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
    <div className="flex w-full h-12 border-b px-4 bg-tertiary border-quaternary focus-within:border-quinary transition-all">
      <input
        name={name}
        onChange={handleChange}
        type={type}
        value={value}
        placeholder={placeholder}
        className="w-full outline-none bg-tertiary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all placeholder:capitalize"
      />
    </div>
  );
}
