import React, { useEffect, useState } from "react";
import { fetchWrapper } from "../fetchWrapper/fetchWrapper";
import { Props } from "../types";

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
  reload: boolean;
  setAuthenticate: (authenticate: boolean) => void;
  readonly setUserData: (userData: UserData) => void;
  readonly loadUserData: () => Promise<void>;
}

/**
 *  store that is shared with every components
 *  How to use :
 *  const context = React.useContext(UserContext)
 *  context.userData.nickName
 */

export const UserContext = React.createContext<ContextProps>({
  userData: null,
  setUserData: () => null,
  reload: true,
  authenticate: false,
  setAuthenticate: () => false,
  loadUserData: async () => {},
});

const ContextProvider: React.FC<Props> = ({ children }) => {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [authenticate, setAuthenticate] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(true);
  const loadUserData = async () => {
    try {
      const responseCurrentUser = await fetchWrapper("oauth/", { method: "GET" });
      setUserData(responseCurrentUser as UserData);
      setReload(false);
    } catch (error) {
      setReload(false);
      setUserData(null);
      // return null
    }
  };

  useEffect(() => {
    setReload(true);
    loadUserData();
    return () => {};
  }, []);

  const value = {
    userData,
    setUserData,
    loadUserData,
    reload,
    authenticate,
    setAuthenticate,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default ContextProvider;
