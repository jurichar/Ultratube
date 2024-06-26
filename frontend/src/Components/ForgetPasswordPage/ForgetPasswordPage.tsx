// src/Components/ForgetPasswordPage/ResetPasswordPage.tsx
import { useState } from "react";
import { validateEmail } from "../../utils/validateEmail";
import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import { notify } from "../../utils/notifyToast";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!checkFormValidity()) return;
    await resetPassword();
  };

  const checkFormValidity = () => {
    let valid = true;
    let message = "";
    if (!validateEmail) valid = false;
    message += "Email must be valid.\n";
    if (email.length == 0) {
      valid = false;
      message += "Email must be valid.\n";
    }
    if (!valid) {
      notify({ type: "warning", msg: message });
    }
    return valid;
  };
  const resetPassword = async () => {
    try {
      await fetchWrapper("oauth/reset-password/" + email + "/", {
        method: "GET",
      });
      notify({ type: "success", msg: "email successfully send" });
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) message = error.message;
      notify({ type: "error", msg: message });
    }
  };
  return (
    <div className="w-full p-6 gap-10 overflow-y-auto flex flex-col items-center justify-around">
      <h1 className="text-quinary text-heading-lg">Password forget ?</h1>
      <div className="w-full rounded p-6 flex flex-col items-center gap-6 bg-tertiary">
        <form className="w-full flex flex-col gap-4 justify-center items-center" onSubmit={handleFormSubmit}>
          <input
            name="Email"
            className="w-full h-12 outline-none px-4 bg-tertiary border-b border-quaternary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all"
            type="text"
            placeholder="Email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="w-32 h-12 transition-all bg-quaternary text-quinary rounded-full hover:bg-quinary hover:text-tertiary" type="submit">
            {t("save")}
          </button>
        </form>
      </div>
    </div>
  );
}
