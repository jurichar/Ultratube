import React, { useEffect, useState } from "react";
import { fetchWrapper } from "../fetchWrapper/fetchWrapper";
import { Props, language } from "../types";

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
  readonly TriggerReload: () => Promise<void>;
  languageSelected: language;
  setLanguageSelected: (language: language) => void;
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
  languageSelected: "en",
  setLanguageSelected: () => {},
  setAuthenticate: () => false,
  loadUserData: async () => {},
  TriggerReload: async () => {},
});

const ContextProvider: React.FC<Props> = ({ children }) => {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [authenticate, setAuthenticate] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(true);
  const [languageSelected, setLanguageSelected] = useState<language>("en");
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

  async function TriggerReload() {
    await loadUserData();
  }
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
    TriggerReload,
    setAuthenticate,
    languageSelected,
    setLanguageSelected,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default ContextProvider;
