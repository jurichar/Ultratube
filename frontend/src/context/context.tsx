import React, { useContext, useEffect, useState } from "react";
import { fetchWrapper } from "../fetchWrapper/fetchWrapper";

export type UserData = {
  userId: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  omniauth?: boolean;
};

interface ContextProps {
  readonly userData: UserData | null;
  authenticate: boolean;
  setAuthenticate: (authenticate: boolean) => void;
  readonly setUserData: (userData: UserData) => void;
  readonly loadUserData: () => Promise<void>;
}

export interface Props {
  children: React.ReactNode;
}
/**
 *  store that is shared with every components
 *  How to use :
 *  const context = React.useContext(UserContext)
 *  context.userData.nickName
 */

const UserContext = React.createContext<ContextProps>({
  userData: null,
  setUserData: () => null,
  authenticate: false,
  setAuthenticate: () => false,
  loadUserData: async () => {},
});

const ContextProvider: React.FC<Props> = ({ children }) => {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [authenticate, setAuthenticate] = useState<boolean>(false);

  const loadUserData = async () => {
    try {
      const responseCurrentUser = await fetchWrapper("oauth/", { method: "GET" });
      setUserData(responseCurrentUser as UserData);
      return responseCurrentUser;
    } catch (error) {
      setUserData(null);
      return null;
    }
  };

  useEffect(() => {
    loadUserData();
    return () => {};
  }, []);

  const value = {
    userData,
    setUserData,
    loadUserData,
    authenticate,
    setAuthenticate,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
  return useContext(UserContext);
};
export default ContextProvider;
