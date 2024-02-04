import { ChangeEvent, MouseEvent, useReducer } from "react";
import FormAuthenticate from "../Global/FormAuthenticate/FormAuthenticate";
import LogoComponent from "../Global/LogoComponent/LogoComponent";
import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import { FormInput, RegisterType } from "../../types";
import { reducer } from "./reducer";
import { validateEmail } from "../../utils/validateEmail";
import { useNavigate } from "react-router-dom";

const initialState: RegisterType = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  password1: "",
};

export default function Register() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

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
    { name: "password1", value: state.password1, placeholder: "Repeat password", handleChange },
  ];

  const is_valid_arg = ({ username, firstName, lastName, email, password, password1 }: RegisterType): boolean => {
    if (username.length == 0 || firstName.length == 0 || lastName.length == 0 || email.length == 0 || password.length == 0 || password1.length == 0) return false;
    if (password != password1) return false;
    if (!validateEmail(email)) return false;
    // if password enough secure
    return true;
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>, name: string) => {
    event.preventDefault();
    event.stopPropagation();
    if (name == "Register") {
      if (is_valid_arg({ ...state })) {
        await createUser();
        navigate("/profile");
      } else {
        console.log("cant create");
      }
    }
  };
  async function createUser() {
    try {
      await fetchWrapper("oauth/register/", {
        method: "POST",
        body: {
          username: state.username,
          first_name: state.firstName,
          last_name: state.lastName,
          email: state.email,
          password: state.password,
        },
      });
    } catch (error) {
      console.log(error);
    }
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
