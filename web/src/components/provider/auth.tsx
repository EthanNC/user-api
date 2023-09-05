import { ReactNode, createContext, useContext, useMemo } from "react";
import invariant from "tiny-invariant";

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
  parseTokenFromUrl: () => User | null;
}

function decodeToken(input: { token: string }): User {
  const [, payloadEncoded] = input.token.split(".");
  invariant(payloadEncoded, "Invalid access token");
  const payload = JSON.parse(
    atob(payloadEncoded.replace(/-/g, "+").replace(/_/g, "/"))
  );
  console.log("🤖 Decoded token", JSON.stringify(payload, null, 2));
  return {
    ...payload,
    token: input.token,
  };
}

const store = {
  get() {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw) as User;
  },
  set(input: { user: User }) {
    return localStorage.setItem("user", JSON.stringify(input.user));
  },
  remove() {
    return localStorage.removeItem("user");
  },
};

function logout() {
  store.remove();
  location.href = location.origin;
}

export function parseTokenFromUrl() {
  const search = window.location.search;
  const params = new URLSearchParams(search);

  const access_token = params.get("access_token");

  if (access_token) {
    // Handling an auth callback, this should become the authoritative account
    const _account = decodeToken({ token: access_token });
    console.log(
      "🤖 Auth registering account from callback",
      JSON.stringify(_account, null, 2)
    );
    store.set({ user: _account });
    return _account;
  }
  return store.get();
}

//manually set user

// Create the Auth Context object
const AuthContext = createContext<AuthContextType>({
  user: undefined,
  logout,
  parseTokenFromUrl,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = useMemo(parseTokenFromUrl, []);

  const value = {
    user,
    logout,
    parseTokenFromUrl,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const result = useContext(AuthContext);
  if (!result) throw new Error("useAuth must be used within an AuthProvider");
  return result;
}
