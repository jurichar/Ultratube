import { ChangeEvent, useRef } from "react";
interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
  placeholder: string;
  type: string;
}
export default function InputGlobal({ handleChange, name, value, placeholder, type }: Props) {
  const monElementRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFocused = useRef<boolean>(false);

  const addHoverAfter = () => {
    if (monElementRef.current && isFocused.current == false) {
      inputRef.current?.classList.add("text-quinary", "placeholder:text-quinary");
      monElementRef.current.classList.remove("after:bg-quinary", "after:animate-[wiggleout_3s_ease-in-out]");
      monElementRef.current.classList.add("after:bg-quinary", "after:animate-[wiggle_3s_ease-in-out]");
    }
  };
  const addFocusedAfter = () => {
    if (monElementRef.current && isFocused.current == false) {
      isFocused.current = true;

      inputRef.current?.classList.remove("placeholder:text-quinary");
      monElementRef.current.classList.add("after:bg-quinary");
    }
  };
  const removeFocusedAfter = () => {
    if (monElementRef.current) {
      inputRef.current?.classList.remove("placeholder:text-quinary");
      monElementRef.current.classList.remove("after:bg-quaternary", "after:animate-[wiggle_3s_ease-in-out]");
      monElementRef.current.classList.add("after:bg-quaternary", "after:animate-[wiggleout_3s_ease-in-out]");
      isFocused.current = false;
    }
  };
  const removeHoverAfter = () => {
    if (monElementRef.current && isFocused.current == false) {
      inputRef.current?.classList.remove("placeholder:text-quinary");
      monElementRef.current.classList.remove("after:bg-quaternary", "after:animate-[wiggle_3s_ease-in-out]");
      monElementRef.current.classList.add("after:bg-quaternary", "after:animate-[wiggleout_3s_ease-in-out]");
    }
  };
  return (
    <div ref={monElementRef} className="relative w-full after:content-[' ']  after:top-full  after:left-0 after:w-full  after:absolute after:h-0.5">
      <input
        ref={inputRef}
        name={name}
        onChange={handleChange}
        // onFocus={addFocusedAfter}
        // onBlur={removeFocusedAfter} // call onchange here  -> one call after typing
        // onMouseEnter={addHoverAfter}
        // onMouseLeave={removeHoverAfter}
        type={type}
        placeholder={placeholder}
        className="relative w-full pl-2 h-9  text-quinary border-none outline-none bg-transparent"
      />
    </div>
  );
}
