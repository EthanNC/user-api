import { User, useAuth } from "@/components/provider/auth";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export function Callback() {
  const [user, setUser] = useState<User | null>(null);
  const { parseTokenFromUrl } = useAuth();

  useEffect(() => {
    const newUser = parseTokenFromUrl();
    setUser(newUser);
  }, []);

  if (user?.applicationId) {
    return <Navigate to={`/applications/${user.applicationId}`} />;
  } else {
    return <Navigate to="/" />;
  }
}
