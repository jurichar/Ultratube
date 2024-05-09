import { MouseEvent, useReducer } from "react";
import FormAuthenticate from "../Global/FormAuthenticate/FormAuthenticate";
import LogoComponent from "../Global/LogoComponent/LogoComponent";
import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import { FormInput, RegisterType } from "../../types";
import { reducer } from "./reducer";
import { validateEmail } from "../../utils/validateEmail";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { notify } from "../../utils/notifyToast";
import { validatePassword } from "../../utils/validatePassword";

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
  const { TriggerReload } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "change", name: event.target.name, value: event.target.value });
  };
  const formInput: FormInput[] = [
    { name: "username", value: state.username, placeholder: "username", handleChange },
    { name: "firstName", value: state.firstName, placeholder: "first_name", handleChange },
    { name: "lastName", value: state.lastName, placeholder: "last_name", handleChange },
    { name: "email", value: state.email, placeholder: "email", handleChange },
    { name: "password", value: state.password, placeholder: "password", handleChange },
    { name: "password1", value: state.password1, placeholder: "Repeat password", handleChange },
  ];

  const is_valid_arg = ({ username, firstName, lastName, email, password, password1 }: RegisterType): boolean => {
    if (username.length == 0 || firstName.length == 0 || lastName.length == 0 || email.length == 0 || password.length == 0 || password1.length == 0) return false;
    if (password != password1) {
      notify({ type: "error", msg: "password are note the same" });
      return false;
    }
    if (!validateEmail(email)) {
      notify({ type: "error", msg: "You email is not valid" });
      return false;
    }
    if (!validatePassword(password)) {
      notify({ type: "error", msg: "You password doesn't fit the security, you need caps lock, specific characters, min 8 length password and number" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>, name: string) => {
    event.preventDefault();
    event.stopPropagation();
    if (name == "register") {
      if (is_valid_arg({ ...state })) {
        await createUser();
      } else {
        notify({ type: "error", msg: "argument are not valid" });
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
      await TriggerReload();
      navigate("/profile");
      notify({ type: "success", msg: "register complete " });
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) message = error.message;
      notify({ type: "error", msg: message });
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
        valueLinkOtherAuth={"login"}
        handleSubmit={handleSubmit}
        nameForm="register"
        formInput={formInput}
        nameSubmit="Create an account"
      />
    </div>
  );
}
