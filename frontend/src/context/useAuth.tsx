import { useContext } from "react";
import { UserContext } from "./context";

export const useAuth = () => {
  return useContext(UserContext);
};
