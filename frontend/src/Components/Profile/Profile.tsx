// src/Components/Profile/Profile.tsx

import Users from "../../utils/users.json";
import { User } from "../../types";

export default function Profile() {
  const user: User = Users[0];

  const handleDisconnect = () => {
    console.log("User disconnected");
  };

  const handleImageEdit = () => {
    console.log("User edited image");
  }

  const handleFormSubmit = () => {
    console.log("User edited profile");
  }

  return (
    <div className="w-full p-14 gap-10 overflow-y-auto flex flex-col items-center justify-around">
      <h1 className="text-quinary text-heading-lg">Edit profile</h1>
      <button className="w-32 h-32 rounded-full relative transition-all transform hover:scale-105 outline outline-transparent outline-4 hover:outline-white " style={{
        backgroundImage: `url(${user.avatar})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }} onClick={handleImageEdit}>
        <img className="absolute -right-1 -bottom-1 h-12 w-12" src="https://static-assets.bamgrid.com/product/disneyplus/images/edit.0a8445c2cff0e80361b2e66906aaeca0.svg" alt="edit-svg" />
      </button>
      <div className="w-full rounded p-6 flex flex-col items-center gap-6 bg-tertiary">
        <h2 className="text-quinary mb-4 text-heading-md">Personal Information</h2>
        <form className="w-full flex flex-col gap-4 justify-center items-center" onSubmit={handleFormSubmit}>
          <input className="w-full h-12 outline-none px-4 bg-tertiary border-b border-quaternary text-quaternary focus:text-quinary placeholder:text-quaternary" type="text" placeholder="Name" defaultValue={user.name} />
          <input className="w-full h-12 outline-none px-4 bg-tertiary border-b border-quaternary text-quaternary focus:text-quinary placeholder:text-quaternary" type="text" placeholder="Email" defaultValue={user.email} />
          <input className="w-full h-12 outline-none px-4 bg-tertiary border-b border-quaternary text-quaternary focus:text-quinary placeholder:text-quaternary" type="text" placeholder="Password" defaultValue={user.password} />
          <button className="w-32 h-12 transition-all bg-quaternary text-quinary rounded-full hover:bg-secondary" type="submit">Save</button>
        </form>
      </div>
      <button className="w-32 h-12 transition-all  text-quinary rounded-full hover:bg-secondary" onClick={handleDisconnect}>Disconnect</button>
    </div >
  );
}
