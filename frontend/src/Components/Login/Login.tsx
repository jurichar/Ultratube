import { ChangeEvent, MouseEvent } from "react";
// import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import FormAuthenticate from "../Global/FormAuthenticate/FormAuthenticate";
import LogoComponent from "../Global/LogoComponent/LogoComponent";
import { FormInput } from "../Register/Register";

export default function Login() {
  const handleChange = (event: ChangeEvent) => {
    console.log("lol", event);
  };
  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(event);
  };
  const formInput: FormInput[] = [
    { name: "username", value: "", placeholder: "username", handleChange },
    { name: "password", value: "", placeholder: "password", handleChange },
  ];
  return (
    <div className="flex flex-col w-full">
      <header className="w-full flex justify-center mt-12">
        <LogoComponent width="md" />
      </header>
      <FormAuthenticate
        nameOtherAuth={"Don’t have an account?"}
        linkOtherAUth={"/register"}
        valueLinkOtherAuth={"Register"}
        handleSubmit={handleSubmit}
        nameForm="Login"
        formInput={formInput}
        nameSubmit="Login to your account"
      />
    </div>
  );
  // return (
  //   <div>
  //     Register

  //     <LogoComponent />
  //     <a
  //       href={`${import.meta.env.VITE_DISCORD_URL}/authorize?client_id=${import.meta.env.VITE_DISCORD_UID}&response_type=code&redirect_uri=${
  //         import.meta.env.VITE_DISCORD_REDIRECT
  //       }&scope=identify`}
  //     >
  //       log with discord
  //     </a>
  //     <a href={`${import.meta.env.VITE_FT_URL}/authorize?client_id=${import.meta.env.VITE_FT_UID}&redirect_uri=${import.meta.env.VITE_FT_REDIRECT}&response_type=code`}> log with 42</a>
  //     <a href={`${import.meta.env.VITE_GITHUB_URL}/authorize?client_id=${import.meta.env.VITE_GITHUB_UID}&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT}&response_type=code`}>
  //       {" "}
  //       log with github
  //     </a>
  //     <button style={{ backgroundColor: "red" }} onClick={handlePermission}>
  //       {" "}
  //       test if we have right
  //     </button>
  //     {/* <button onClick={auth42}> LOG with 0auth2 </button> */}
  //   </div>
  // );
}
