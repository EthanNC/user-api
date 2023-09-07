import { useAuth } from "@/components/provider/auth";
import { decodeToken, store } from "@/lib/utils";
import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

export function Callback() {
  const { user, setUser } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("access_token");
    if (token) {
      const user = decodeToken({ token });
      store.set({ user });
      setUser(user);
    }
  }, [searchParams, setUser, user]);

  if (user?.applicationId) {
    return <Navigate to={`/applications/${user.applicationId}`} />;
  } else {
    return <Navigate to="/" />;
  }
}
