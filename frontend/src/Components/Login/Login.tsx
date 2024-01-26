import { ChangeEvent, MouseEvent, useReducer } from "react";
// import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import FormAuthenticate from "../Global/FormAuthenticate/FormAuthenticate";
import LogoComponent from "../Global/LogoComponent/LogoComponent";
import { FormInput, AppAction } from "../Register/type";

interface ReducerType {
  username: string;
  password: string;
}

function reducer(state: ReducerType, action: AppAction) {
  switch (action.type) {
    case "change":
      return {
        ...state,
        [action.name]: action.value,
      };
    default:
      break;
  }
}
export default function Login() {
  const [state, dispatch] = useReducer(reducer, { username: "", password: "" });
  const handleChange = (event: ChangeEvent) => {
    dispatch({ type: "change", name: event.target.name, value: event.target.value });
  };
  const handleSubmit = (event: MouseEvent<HTMLButtonElement>, name: string) => {
    event.preventDefault();
    console.log(event);
    if (name == "Login") {
      console.log("log in ");
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
