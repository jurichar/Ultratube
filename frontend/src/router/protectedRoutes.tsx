import { useEffect, useState } from "react";
import { useAuth } from "../context/context";
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
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
    if (userData == null) {
      return navigate("/login");
    }
  }
  if (!loading) {
    return <>{children}</>;
  }
  return;
}
