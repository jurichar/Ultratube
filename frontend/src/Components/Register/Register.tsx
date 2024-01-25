import { ChangeEvent, MouseEvent, useReducer } from "react";
// import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import FormAuthenticate from "../Global/FormAuthenticate/FormAuthenticate";
import LogoComponent from "../Global/LogoComponent/LogoComponent";
import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";

export type FormInput = { name: string; value: string; placeholder: string; handleChange: (event: ChangeEvent<HTMLInputElement>) => void };
type AppAction = {
  type: string;
  value: string;
};
interface ReducerType {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password1: string;
}
function reducer(state: ReducerType, action: AppAction) {
  switch (action.type) {
    case "change-username":
      return {
        username: action.value,
      };
    case "change-firstname":
      return {
        firstName: action.value,
      };
    case "change-lastname":
      return {
        lastName: action.value,
      };
    case "change-email":
      return {
        email: action.value,
      };
    case "change-password":
      return {
        password: action.value,
      };
    case "change-password1":
      return {
        password1: action.value,
      };
    default:
      break;
  }
}

export default function Register() {
  const [state, dispatch] = useReducer(reducer, { username: "", firstName: "", lastName: "", email: "", password: "", password1: "" });
  const handlePermission = () => {
    fetchWrapper("oauth/user/", { method: "get" })
      .then((data) => console.log(data))
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (event: ChangeEvent) => {
    const nameInput = event.target.name;
    console.log(event.target.value);
    console.log(nameInput);
    switch (nameInput) {
      case "username":
        dispatch({ type: "change-username", value: event.target.value });
        break;
      case "firstName":
        dispatch({ type: "change-firstName", value: event.target.value });
        break;
      case "lastName":
        dispatch({ type: "change-lastName", value: event.target.value });
        break;
      case "email":
        dispatch({ type: "change-email", value: event.target.value });
        break;
      case "password":
        dispatch({ type: "change-password", value: event.target.value });
        break;
      case "password-1":
        dispatch({ type: "change-password1", value: event.target.value });
        break;
    }
  };
  console.log(state);
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
