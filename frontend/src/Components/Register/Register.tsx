import { ChangeEvent, MouseEvent } from "react";
// import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import FormAuthenticate from "../Global/FormAuthenticate/FormAuthenticate";
import LogoComponent from "../Global/LogoComponent/LogoComponent";

export type FormInput = { name: string; value: string; placeholder: string; handleChange: (event: ChangeEvent<HTMLInputElement>) => void };
export default function Register() {
  // const handlePermission = () => {
  //   fetchWrapper("oauth/user/", { method: "get" })
  //     .then((data) => console.log(data))
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const handleChange = (event: ChangeEvent) => {
    console.log("lol", event);
  };
  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(event);
  };
  const formInput: FormInput[] = [
    { name: "username", value: "", placeholder: "username", handleChange },
    { name: "firstName", value: "", placeholder: "first name", handleChange },
    { name: "lastName", value: "", placeholder: "last name", handleChange },
    { name: "email", value: "", placeholder: "email", handleChange },
    { name: "password", value: "", placeholder: "password", handleChange },
    { name: "password-1", value: "", placeholder: "Repeat password", handleChange },
  ];
  return (
    <div className="flex flex-col w-full">
      <header className="w-full flex justify-center mt-12">
        <LogoComponent width="md" />
      </header>
      <FormAuthenticate
        nameOtherAuth={"Already have an account ?"}
        linkOtherAUth={"/login"}
        valueLinkOtherAuth={"Login"}
        handleSubmit={handleSubmit}
        nameForm="Register"
        formInput={formInput}
        nameSubmit="Create an account"
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
