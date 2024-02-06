import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function UnAuthenticateRoutes({ children }) {
  const { userData, reload } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (userData && "username" in userData && "email" in userData && "omniauth" in userData) {
      setLoading(false);
      return navigate("/");
    } else {
      if (!userData && !reload) {
        setLoading(false);
      }
    }
  }, [reload, userData, navigate]);

  if (!loading) {
    return <>{children}</>;
  }
  return;
}
