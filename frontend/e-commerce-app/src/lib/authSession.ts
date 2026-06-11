export type AuthRole = "admin" | "buyer" | "customer" | "seller" | "support";

export type AuthSession = {
  username: string;
  role: AuthRole;
  isAuthenticated: boolean;
};

const USERNAME_KEY = "username";
const ROLE_KEY = "userRole";

const normalizeRole = (role: string | null): AuthRole => {
  const value = (role ?? "customer").trim().toLowerCase().replace(/^role_/, "");

  if (value === "admin" || value === "buyer" || value === "seller" || value === "support") {
    return value;
  }

  return "customer";
};

export const getAuthSession = (): AuthSession => {
  if (typeof window === "undefined") {
    return {
      username: "",
      role: "customer",
      isAuthenticated: false,
    };
  }

  const username = window.sessionStorage.getItem(USERNAME_KEY)?.trim() ?? "";
  const role = normalizeRole(window.sessionStorage.getItem(ROLE_KEY));

  return {
    username,
    role,
    isAuthenticated: username.length > 0,
  };
};

export const saveAuthSession = (username: string, role: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(USERNAME_KEY, username.trim());
  window.sessionStorage.setItem(ROLE_KEY, normalizeRole(role));
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(USERNAME_KEY);
  window.sessionStorage.removeItem(ROLE_KEY);
};

export const getRoleHomePath = (role: AuthRole) => {
  if (role === "admin") {
    return "/admin/dashboard";
  }

  if (role === "seller") {
    return "/seller/dashboard";
  }

  if (role === "support") {
    return "/admin/support";
  }

  return "/dashboard";
};

