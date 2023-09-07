import {
  useRouteError,
  isRouteErrorResponse,
  Navigate,
  Link,
  useLocation,
  To,
} from "react-router-dom";

import { ReactNode } from "react";
import { Button } from "./ui/button";

const didBecomeUnauthenticated = (error: unknown) => {
  if (
    (isRouteErrorResponse(error) || error instanceof Response) &&
    error.status === 401
  ) {
    return true;
  }

  return false;
};

// const matchesNotImplementedRoute = (location: Location) => {
//   return NOT_IMPLEMENTED_ROUTES.some((path) => {
//     return matchPath(path, location.pathname);
//   });
// };

const RootErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <ErrorBody error={error} />
    </div>
  );
};

interface ErrorBodyProps {
  error: unknown;
}

const ErrorBody = ({ error }: ErrorBodyProps) => {
  const location = useLocation();
  const isNotFoundError = isRouteErrorResponse(error) && error.status === 404;

  if (isNotFoundError) {
    return (
      <>
        <ErrorTitle>Page not found</ErrorTitle>
        <ErrorDescription>
          We can&apos;t seem to find the page you are looking for.
        </ErrorDescription>
        <ErrorActionLink to="/">Home</ErrorActionLink>
      </>
    );
  }

  if (didBecomeUnauthenticated(error)) {
    return <Navigate to="/logged-out" />;
  }

  return (
    <>
      <ErrorTitle>Oops</ErrorTitle>
      <ErrorDescription>
        Something went wrong. Try{" "}
        <a className="underline" href={location.pathname}>
          reloading the page
        </a>
        , otherwise go back{" "}
        <Link to="/" className="underline">
          home
        </Link>
        .
      </ErrorDescription>
    </>
  );
};

interface ErrorTitleProps {
  children: ReactNode;
}

const ErrorTitle = ({ children }: ErrorTitleProps) => {
  return <h1 className="mb-4 text-5xl">{children}</h1>;
};

interface ErrorDescriptionProps {
  children: ReactNode;
}

const ErrorDescription = ({ children }: ErrorDescriptionProps) => {
  return <p className="mb-8 max-w-lg text-center text-lg">{children}</p>;
};

interface ErrorActionLinkProps {
  children: ReactNode;
  to: To;
}

const ErrorActionLink = ({ children, to }: ErrorActionLinkProps) => {
  return (
    <Button asChild variant="secondary">
      <Link to={to}>{children}</Link>
    </Button>
  );
};

export default RootErrorBoundary;
