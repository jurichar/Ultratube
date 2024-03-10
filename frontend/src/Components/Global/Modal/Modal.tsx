import { useState } from "react";

export default function Modal() {
  const [open, setOpen] = useState(false);

  return (
    <div className=" w-full">
      <button onClick={() => setOpen(!open)}> open filter</button>
      {open && <div className="static w-full h-full -top-auto bg-slate-300 z-40"> bjr </div>}
    </div>
  );
}
