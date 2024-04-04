import { useNavigate } from "react-router-dom";
import { fetchWrapper } from "../../../fetchWrapper/fetchWrapper";
import { notify } from "../../../utils/notifyToast";
import { useAuth } from "../../../context/useAuth";

export default function DisconnectButton() {
  const navigate = useNavigate();
  const { loadUserData } = useAuth();

  const handleDisconnect = async () => {
    try {
      await fetchWrapper("oauth/logout/", { method: "POST" });
      await loadUserData();
      navigate("/");
      notify({ type: "success", msg: "disconnection successfully" });
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) message = error.message;
      notify({ type: "error", msg: message });
    }
  };
  return (
    <div className="w-10 h-10 bg-[url('./src/assets/exit.svg')] bg-cover bg-no-repeat bg-center transition-all" onClick={handleDisconnect}>
      <div className="w-10 h-10 bg-[url('./src/assets/exit-hover.svg')] bg-cover bg-no-repeat bg-center opacity-0 hover:opacity-50 transition-all"></div>
    </div>
  );
}
