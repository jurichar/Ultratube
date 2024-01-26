import { ChangeEvent, MouseEvent, useReducer } from "react";
// import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import FormAuthenticate from "../Global/FormAuthenticate/FormAuthenticate";
import LogoComponent from "../Global/LogoComponent/LogoComponent";
import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import { FormInput, AppAction, ReducerType } from "../../types";

function reducer(state: ReducerType, action: AppAction): ReducerType {
  switch (action.type) {
    case "change":
      return {
        ...state,
        [action.name]: action.value,
      };
    default:
      return state;
      break;
  }
}

export default function Register() {
  const initialState: ReducerType = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password1: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const handlePermission = () => {
    fetchWrapper("oauth/user/", { method: "get" })
      .then((data) => console.log(data))
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (event: ChangeEvent) => {
    dispatch({ type: "change", name: event.target.name, value: event.target.value });
  };
  const formInput: FormInput[] = [
    { name: "username", value: state.username, placeholder: "username", handleChange },
    { name: "firstName", value: state.firstName, placeholder: "first name", handleChange },
    { name: "lastName", value: state.lastName, placeholder: "last name", handleChange },
    { name: "email", value: state.email, placeholder: "email", handleChange },
    { name: "password", value: state.password, placeholder: "password", handleChange },
    { name: "password-1", value: state.password1, placeholder: "Repeat password", handleChange },
  ];
  const handleSubmit = (event: MouseEvent<HTMLButtonElement>, name: string) => {
    event.preventDefault();
    event.stopPropagation();
    if (name == "Register") {
      // if not null
      //tchek if input is correct
      // if password == pssw1
      // if email is good
      createUser();
    }
  };
  async function createUser() {
    await fetchWrapper("oauth/register/", {
      method: "POST",
      body: {
        username: "test",
        first_name: "lol",
        last_name: "lol",
        email: "lololo@lol.com",
        password: "123",
      },
    });
  }
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
      <button onClick={handlePermission}> click</button>
    </div>
  );
}
