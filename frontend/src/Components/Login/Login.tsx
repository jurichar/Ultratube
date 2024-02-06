import { MouseEvent, useReducer } from "react";
import FormAuthenticate from "../Global/FormAuthenticate/FormAuthenticate";
import LogoComponent from "../Global/LogoComponent/LogoComponent";
import { FormInput, LoginType } from "../../types";
import { reducer } from "./reducer";
import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import { useNavigate } from "react-router-dom";

const initialState: LoginType = {
  username: "",
  password: "",
};

export default function Login() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "change", name: event.target.name, value: event.target.value });
  };

  const is_valid_arg = ({ username, password }: LoginType): boolean => {
    if (username.length == 0 || password.length == 0) return false;
    return true;
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>, name: string) => {
    event.preventDefault();
    console.log(event);
    if (name == "Login") {
      if (is_valid_arg({ ...state })) {
        await login();
        navigate("/profile");
      } else {
        console.log("cant login");
      }
      console.log("log in ");
    }
  };

  const login = async () => {
    try {
      await fetchWrapper("oauth/login/", {
        method: "POST",
        body: {
          username: state.username,
          password: state.password,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const formInput: FormInput[] = [
    { name: "username", value: state.username, placeholder: "username", handleChange },
    { name: "password", value: state.password, placeholder: "password", handleChange },
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
}
