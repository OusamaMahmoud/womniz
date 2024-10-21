import React, { createContext, useContext, useState, ReactNode } from "react";
interface StateContextProps {
  chat: boolean;
  cart: boolean;
  userProfile: boolean;
  notification: boolean;
}

interface ContextProps {
  activeMenu: boolean;
  screenSize: number | undefined;
  setScreenSize: React.Dispatch<React.SetStateAction<number | undefined>>;
  handleClick: (clicked: keyof StateContextProps) => void;
  isClicked: StateContextProps;
  initialState: StateContextProps;
  setIsClicked: React.Dispatch<React.SetStateAction<StateContextProps>>;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setLang:React.Dispatch<React.SetStateAction<string>>;
  lang:string;
}

const StateContext = createContext<ContextProps | undefined>(
  {} as ContextProps
);

const initialState: StateContextProps = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [screenSize, setScreenSize] = useState<number | undefined>(undefined);
  const [activeMenu, setActiveMenu] = useState<boolean>(true);
  const [lang, setLang] = useState<string>('');
  const [isClicked, setIsClicked] = useState<StateContextProps>(initialState);

  const handleClick = (clicked: keyof StateContextProps) =>
    setIsClicked({ ...initialState, [clicked]: true });

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setLang,
        lang
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = (): ContextProps => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a ContextProvider");
  }
  return context;
};
