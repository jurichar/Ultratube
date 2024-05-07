import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { Props } from "../types";

export default function UnAuthenticateRoutes({ children }: Props) {
  const { userData, reload } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (userData && "username" in userData && "email" in userData && "omniauth" in userData) {
      setLoading(false);
      return navigate("/login");
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
