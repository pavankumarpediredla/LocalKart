import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  getAuthSession,
  getRoleHomePath,
  type AuthRole,
} from "../lib/authSession";

type AccessGuardProps = {
  children: ReactNode;
  allowedRoles?: AuthRole[];
};

export const RequireAuth = ({ children, allowedRoles }: AccessGuardProps) => {
  const location = useLocation();
  const session = getAuthSession();

  if (!session.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return <Navigate to={getRoleHomePath(session.role)} replace />;
  }

  return <>{children}</>;
};

export const RedirectIfAuthenticated = ({ children }: { children: ReactNode }) => {
  const session = getAuthSession();

  if (session.isAuthenticated) {
    return <Navigate to={getRoleHomePath(session.role)} replace />;
  }

  return <>{children}</>;
};

