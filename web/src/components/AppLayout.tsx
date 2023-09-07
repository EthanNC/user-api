import { Link, Outlet, useNavigation } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "./provider/auth";
import UserDropdown from "./UserDropdown";

const Loading = () => (
  <div className="flex h-screen w-screen animate-pulse items-center justify-center text-5xl font-black text-zinc-900/20 dark:text-zinc-500/40">
    <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin"></div>
  </div>
);

const NavigationLoader = () => {
  const navigation = useNavigation();

  return navigation.state !== "idle" ? <span className="loader" /> : <></>;
};

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      <header className="container py-6">
        <nav className="flex items-center justify-between">
          <Link to="/">
            <div className="flex items-center gap-2">
              <div className="font-bold">MultiTenant</div>
              <div className="font-light">App</div>
            </div>
          </Link>

          <div className="flex items-center gap-10">
            {user && <UserDropdown email={user.email} logout={logout} />}
          </div>
        </nav>
      </header>
      <div className="flex-1">
        <Suspense fallback={<Loading />}>
          <main className="mx-auto max-w-3xl">
            <NavigationLoader />
            <Outlet />
          </main>
        </Suspense>
      </div>
    </div>
  );
}
