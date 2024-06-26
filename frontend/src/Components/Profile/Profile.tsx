// src/Components/Profile/Profile.tsx

import { useEffect, useState } from "react";
import ImagePopup from "./ImagePopup";
import { useTranslation } from "react-i18next";
import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";
import { useLoaderData, useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { ProfileForm, UserData, UserPatchInterface } from "../../types";
import { validateEmail } from "../../utils/validateEmail";
import { notify } from "../../utils/notifyToast";
import InputPassword from "../Global/InputPassword/InputPassword";
import { validatePassword } from "../../utils/validatePassword";

export default function Profile() {
  const { t } = useTranslation();
  const param = useParams(); // get params from the url
  const userLoader = useLoaderData(); // get data (user) from the loader ( see routes.tsx to see the loader)
  const { userData, loadUserData } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [showImagePopup, setShowImagePopup] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [ourProfile, setOurProfile] = useState(false);
  const [user, setUser] = useState<UserData>({ username: "", email: "", first_name: "", last_name: "", avatar: "" });
  const [idUser, setIdUser] = useState<number>(0);
  const [formData, setFormData] = useState<ProfileForm>({
    username: user.username,
    email: user.email,
    first_name: user?.first_name,
    last_name: user?.last_name,
    password: "",
  });

  useEffect(() => {
    const initialize_data = () => {
      if (userLoader) {
        setUser(userLoader as UserData);
        setOurProfile(false);
        if (param && "id" in param) {
          if (!isNaN(Number(param.id))) {
            setIdUser(Number(param.id));
          }
        }
      } else {
        if (userData) {
          setOurProfile(true);
          setUser(userData);
          if ("id" in userData) {
            if (!isNaN(Number(userData.id))) {
              setIdUser(Number(userData.id));
            }
          }
        }
      }
    };
    initialize_data();
    setLoading(false);
  }, [userLoader, userData, param]);

  if (loading) {
    return <div className="bg-red-600 text-white">loading</div>;
  }

  const handleImageEdit = () => {
    if (!ourProfile) {
      return;
    }
    setShowImagePopup(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clean_data_form(formData);
    if (!handleCheckEmail(formData)) {
      return;
    }
    if (!handleCheckPassword(formData)) {
      return;
    }

    call_db_patch(formData);
  };

  /**       UTILS FOR SUBMIT  **/
  const clean_data_form = (formData: ProfileForm) => {
    Object.keys(formData)?.map((elem) => {
      if (formData[elem as keyof ProfileForm]?.length == 0) {
        delete formData[elem as keyof ProfileForm];
      }
    });
  };
  const handleCheckEmail = (formData: ProfileForm): boolean => {
    if ("email" in formData) {
      if (formData["email"]) {
        if (!validateEmail(formData["email"])) {
          notify({ type: "warning", msg: "email not valid, please retry with another one" });
          return false;
        }
      }
    }
    return true;
  };
  const handleCheckPassword = (formData: ProfileForm): boolean => {
    if ("password" in formData) {
      if (formData["password"]) {
        if (!validatePassword(formData["password"])) {
          notify({ type: "error", msg: "You password doesnt fit the security, you need capslock, specific characters, min 8 length password and number" });
          return false;
        }
      }
    }
    return true;
  };

  const call_db_patch = async (formData: ProfileForm) => {
    let dataUserPatch: UserPatchInterface = { ...formData };
    if (selectedImage.length > 0) {
      dataUserPatch = { ...dataUserPatch, avatar: "http://localhost:3000" + selectedImage.slice(1) };
    }
    try {
      await fetchWrapper("oauth/users/" + idUser + "/", { method: "PATCH", body: dataUserPatch });
      await loadUserData();
      notify({ type: "success", msg: "update successful" });
    } catch (error) {
      const { message } = error as Error;
      notify({ type: "error", msg: message });
    }
  };

  return (
    <div className="w-full p-6 gap-10 overflow-y-auto flex flex-col items-center justify-around">
      {!ourProfile ? <h1 className="text-quinary text-heading-lg">profile</h1> : <h1 className="text-quinary text-heading-lg">{t("edit")}</h1>}
      <button
        className="w-32 h-32 rounded-full relative transition-all transform hover:scale-105 outline outline-transparent outline-4 hover:outline-white "
        style={{
          backgroundImage: `url(${selectedImage || user.avatar})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={handleImageEdit}
      >
        <img className="absolute -right-1 -bottom-1 h-12 w-12" src="https://static-assets.bamgrid.com/product/disneyplus/images/edit.0a8445c2cff0e80361b2e66906aaeca0.svg" alt="edit-svg" />
      </button>
      {showImagePopup && ourProfile && <ImagePopup user={user} setShowImagePopup={setShowImagePopup} setSelectedImage={setSelectedImage} />}
      <div className="w-full rounded p-6 flex flex-col items-center gap-6 bg-tertiary">
        <h2 className="text-quinary mb-4 text-heading-md">{t("personalInfo")}</h2>
        <form className="w-full flex flex-col gap-4 justify-center items-center" onSubmit={handleFormSubmit}>
          <input
            name="username"
            className="w-full h-12 outline-none px-4 bg-tertiary border-b border-quaternary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all"
            type="text"
            placeholder="username"
            autoComplete="username"
            defaultValue={user?.username}
            onChange={handleChange}
            disabled={user?.omniauth || !ourProfile}
          />
          {ourProfile && !user?.omniauth && (
            <input
              name="email"
              className="w-full h-12 outline-none px-4 bg-tertiary border-b border-quaternary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all"
              type="text"
              placeholder="Email"
              autoComplete="email"
              defaultValue={user?.email}
              onChange={handleChange}
              disabled={!ourProfile}
            />
          )}
          <input
            name="first_name"
            className="w-full h-12 outline-none px-4 bg-tertiary border-b border-quaternary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all"
            placeholder={t("first_name")}
            autoComplete="given-name"
            defaultValue={user?.first_name}
            onChange={handleChange}
            disabled={!ourProfile}
          />
          <input
            name="last_name"
            className="w-full h-12 outline-none px-4 bg-tertiary border-b border-quaternary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all"
            type={"text"}
            placeholder={t("last_name")}
            autoComplete="family-name"
            defaultValue={user?.last_name}
            onChange={handleChange}
            disabled={!ourProfile}
          />
          {ourProfile && (
            <>
              {!user?.omniauth && <InputPassword name="password" handleChange={handleChange} />}
              <button className="w-32 h-12 transition-all bg-quaternary text-quinary rounded-full hover:bg-quinary hover:text-tertiary" type="submit">
                {t("save")}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
