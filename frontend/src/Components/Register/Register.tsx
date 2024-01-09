import { fetchWrapper } from "../../fetchWrapper/fetchWrapper";

export default function Register() {
  const auth42 = async () => {
    const result = await fetchWrapper("oauth/token/", { method: "get" });
    console.log(result);
  };

  return (
    <div>
      Register
      <button onClick={auth42}> LOG with 0auth2 </button>
    </div>
  );
}
