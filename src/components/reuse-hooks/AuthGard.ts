import { useAuth } from "../../contexts/AuthProvider";

export const useAuthGard = ({ key }: { key: string }) => {
  const { auth } = useAuth();

  return auth?.permissions?.find((per) => per === key);
};
