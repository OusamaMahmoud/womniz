import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

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
  role: string;
  permissions: string[];
}

interface AuthContextValues {
  auth: AuthObject | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthObject | null>>;
}

const AuthContext = createContext<AuthContextValues | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthObject | null>(() => {
    const storedAuth = localStorage.getItem("womnizAuth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      localStorage.setItem("womnizAuth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("womnizAuth");
      navigate("/login");
    }
  }, [auth]);

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
