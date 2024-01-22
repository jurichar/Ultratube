// src/Components/Profile/Profile.tsx

import Users from "../../utils/users.json";
import { User } from "../../types";
import { useState } from "react";
import ImagePopup from "./ImagePopup";

export default function Profile() {
  const user: User = Users[0];
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: "",
    newPassword: "",
  });


  const handleDisconnect = () => {
    console.log("User disconnected");
  };

  const handleImageEdit = () => {
    setShowImagePopup(true);
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!checkFormValidity()) return;
    console.log("Form submitted");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  }

  const hideAndShowPassword = (show: boolean) => {
    return (show ?
      <div className="w-6 h-6 fill-quaternary hover:fill-quinary transition-all" style={
        { transform: "rotate(180deg)" }
      }>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z" />
        </svg>
      </div> :
      <div className="w-6 h-6 fill-quaternary hover:fill-quinary transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
        </svg>
      </div>);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkFormValidity = () => {
    let valid = true;
    let message = "";
    if (!checkNameValidity()) valid = false; message += "Name must be at least 3 characters long.\n";
    if (!checkEmailValidity()) valid = false; message += "Email must be valid.\n";
    if (!checkCurrentPasswordValidity()) valid = false; message += "Current password must be at least 8 characters long.\n";
    if (!checkNewPasswordValidity()) valid = false; message += "New password must be at least 8 characters long and different from current password.\n";
    if (!valid) alert(message);
    return valid;
  }

  const checkNameValidity = () => {
    return formData.name.length >= 3;
  }

  const checkCurrentPasswordValidity = () => {
    return formData.currentPassword.length >= 8;
  }

  const checkNewPasswordValidity = () => {
    return formData.newPassword.length >= 8 && formData.currentPassword !== formData.newPassword;
  }

  const checkEmailValidity = () => {
    return formData.email.includes("@") && formData.email.includes(".");
  }

  return (
    <div className="w-full p-6 gap-10 overflow-y-auto flex flex-col items-center justify-around">
      <h1 className="text-quinary text-heading-lg">Edit profile</h1>
      <button className="w-32 h-32 rounded-full relative transition-all transform hover:scale-105 outline outline-transparent outline-4 hover:outline-white " style={{
        backgroundImage: `url(${selectedImage || user.avatar})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }} onClick={handleImageEdit}>
        <img className="absolute -right-1 -bottom-1 h-12 w-12" src="https://static-assets.bamgrid.com/product/disneyplus/images/edit.0a8445c2cff0e80361b2e66906aaeca0.svg" alt="edit-svg" />
      </button>
      {showImagePopup && (
        <ImagePopup user={user} setShowImagePopup={setShowImagePopup} setSelectedImage={setSelectedImage}
        />)}
      <div className="w-full rounded p-6 flex flex-col items-center gap-6 bg-tertiary">
        <h2 className="text-quinary mb-4 text-heading-md">Personal Information</h2>
        <form className="w-full flex flex-col gap-4 justify-center items-center" onSubmit={handleFormSubmit}>
          <input name="name"
            className="w-full h-12 outline-none px-4 bg-tertiary border-b border-quaternary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all"
            type="text"
            placeholder="Name"
            defaultValue={user.name}
            onChange={handleChange} />
          <input name="Email"
            className="w-full h-12 outline-none px-4 bg-tertiary border-b border-quaternary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all"
            type="text"
            placeholder="Email"
            autoComplete="username"
            defaultValue={user.email}
            onChange={handleChange} />
          <div className="flex w-full h-12 border-b px-4 bg-tertiary border-quaternary focus-within:border-quinary transition-all">
            <input name="currentPassword"
              className="w-full outline-none bg-tertiary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              onChange={handleChange} />
            <button type="button" onClick={togglePasswordVisibility}>
              {hideAndShowPassword(showPassword)}
            </button>
          </div>
          <div className="flex w-full h-12 border-b px-4 bg-tertiary border-quaternary focus-within:border-quinary transition-all">
            <input name="newPassword"
              className="w-full outline-none bg-tertiary text-quaternary focus:text-quinary placeholder:text-quaternary focus:border-quinary transition-all"
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              autoComplete="new-password"
              onChange={handleChange} />
            <button type="button" onClick={toggleNewPasswordVisibility}>
              {hideAndShowPassword(showNewPassword)}
            </button>
          </div>
          <button className="w-32 h-12 transition-all bg-quaternary text-quinary rounded-full hover:bg-quinary hover:text-tertiary" type="submit">Save</button>
        </form>
      </div>
      <button className="w-32 h-12 transition-all  text-quinary rounded-full hover:bg-secondary" onClick={handleDisconnect}>Disconnect</button>
    </div >
  );
}