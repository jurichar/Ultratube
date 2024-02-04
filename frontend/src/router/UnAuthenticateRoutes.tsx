import { useEffect, useState } from "react";
import { useAuth } from "../context/context";
import { useNavigate } from "react-router-dom";

export default function UnAuthenticateRoutes({ children }) {
  const { loadUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    checkAUth();
  }, []);

  async function checkAUth() {
    const userData = await loadUserData();
    setLoading(false);
    if (userData != null) {
      return navigate("/");
    }
  }
  if (!loading) {
    return <>{children}</>;
  }
  return;
}
