import React from "react";

type UserData = {
  userId: string;
  name: string;
  nickName: string;
  email: string;
};

interface ContextProps {
  readonly userData: UserData | null;
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
  loadUserData: async () => {},
});

const ContextProvider: React.FC<Props> = ({ children }) => {
  const [userData, setUserData] = React.useState<UserData | null>(null);

  const loadUserData = async () => {
    console.log("load");
  };

  const value = {
    userData,
    setUserData,
    loadUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, ContextProvider };
