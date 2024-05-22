import { createContext, useContext, useState, ReactNode } from "react";

interface AuthObject {
  name: string;
  email: string;
  password?: string;
  token: string;
  image: string;
  phone: string;
  age: string;
  status: number;
  category: string;
}

interface AuthContextValues {
  auth: AuthObject | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthObject | null>>;
}

const AuthContext = createContext<AuthContextValues | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthObject | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
