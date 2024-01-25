import React, { MouseEvent } from "react";
import InputGlobal from "../InputGlobal/InputGlobal";
import { FormInput } from "../../Register/Register";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction";
import { FaGithub } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";
interface Props {
  handleSubmit: (event: MouseEvent<HTMLButtonElement>, name: string) => void;
  nameForm: string;
  formInput: FormInput[];
  nameSubmit: string;
  nameOtherAuth: "Already have an account ?" | "Don’t have an account?";
  linkOtherAUth: "/register" | "/login";
  valueLinkOtherAuth: "Register" | "Login";
}
export default function FormAuthenticate({ handleSubmit, nameForm, nameOtherAuth, linkOtherAUth, valueLinkOtherAuth, formInput, nameSubmit }: Props) {
  return (
    <div className="  bg-tertiary m-auto p-6 md:p-8  mt-20 w-10/12 h-3/6 md:w-6/12  lg:w-96 lg:h-4/6  rounded">
      <h1 className="mb-10 text-heading-lg text-quinary text-light font-custom"> {nameForm}</h1>
      <form className="flex flex-col gap-6 ">
        {formInput?.map((input, index) => {
          return (
            <React.Fragment key={index}>
              <InputGlobal handleChange={input.handleChange} value={input.value} name={input.name} placeholder={input.placeholder} type="text" />
            </React.Fragment>
          );
        })}
        <ButtonCallToAction handleClick={handleSubmit} type="submit" width="md" name={nameForm} value={nameSubmit} colorHover={"bg-quinary"} Icon={null} />
      </form>
      <div className="flex gap-3 mt-4 justify-evenly">
        <Link
          className={` w-full  flex  flex-row  gap-1 justify-center text-quinary  bg-gray-300 rounded text-body-md font-custom hover:bg-white p-2.5"} `}
          to={`${import.meta.env.VITE_FT_URL}/authorize?client_id=${import.meta.env.VITE_FT_UID}&redirect_uri=${import.meta.env.VITE_FT_REDIRECT}&response_type=code`}
        >
          {" "}
          <img className="size-8" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/512px-42_Logo.svg.png" />{" "}
        </Link>
        <Link
          className={` w-full  flex flex-row flex-row  gap-1 justify-center text-quinary  bg-gray-300 rounded text-body-md font-custom hover:bg-discord p-2.5"} `}
          to={`${import.meta.env.VITE_DISCORD_URL}/authorize?client_id=${import.meta.env.VITE_DISCORD_UID}&response_type=code&redirect_uri=${
            import.meta.env.VITE_DISCORD_REDIRECT
          }&scope=identify`}
        >
          <FaDiscord className="size-8" />
        </Link>
        <Link
          className={` w-full  flex flex-row  gap-1 justify-center text-quinary  bg-gray-300 rounded text-body-md font-custom hover:bg-github p-2.5"} `}
          to={`${import.meta.env.VITE_GITHUB_URL}/authorize?client_id=${import.meta.env.VITE_GITHUB_UID}&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT}&response_type=code`}
        >
          <FaGithub className="size-8" />
        </Link>
      </div>
      <div className="flex w-full gap-3 justify-center mt-4">
        <h3 className="text-quinary text-body-md">{nameOtherAuth}</h3>
        <Link to={linkOtherAUth} className="text-secondary text-body-md">
          {valueLinkOtherAuth}
        </Link>
      </div>
    </div>
  );
}
