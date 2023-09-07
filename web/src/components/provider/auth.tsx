import { decodeToken, store } from "@/lib/utils";
import {
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
} from "react";

export interface User {
  id: string;
  email: string;
  applicationId: string;
  scopes: string[];
  iat: number;
}

interface AuthContextType {
  user?: User | null;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
}

function logout() {
  store.remove();
  location.href = location.origin;
}

// Create the Auth Context object
const AuthContext = createContext<AuthContextType>(
  null as unknown as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const newToken = params.get("access_token");

    if (newToken) {
      // Handling an auth callback, this should become the authoritative account
      const _account = decodeToken({ token: newToken });
      console.log(
        "🤖 Auth registering account from callback",
        JSON.stringify(_account, null, 2)
      );
      store.set({ user: _account });
      setUser(_account);
      return;
    }

    // No auth callback, but lets check for an account in localstorage
    const _account = store.get();
    if (_account) {
      console.log(
        "🤖 Auth rehydrating account from localstorage",
        JSON.stringify(_account, null, 2)
      );
      setUser(_account);
      return;
    }

    console.log("🤖 No active Auth session");
  }, []);

  const value = {
    user,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const result = useContext(AuthContext);
  if (!result) throw new Error("useAuth must be used within an AuthProvider");
  return result;
}
