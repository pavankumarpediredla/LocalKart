export const ADMIN_API_URL =
  import.meta.env.VITE_ADMIN_API_URL ?? "http://localhost:8080/api/admin";

export type AdminStat = {
  label: string;
  value: string;
  detail: string;
};

export type AdminUser = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
};

export type SupportTicket = {
  id: string;
  user: string;
  issue: string;
  priority: string;
};

export type AccountInfo = {
  label: string;
  value: string;
};

export type CustomerSegment = {
  name: string;
  value: string;
  accent: string;
};

export type AdminDashboardResponse = {
  stats: AdminStat[];
  supportTickets: SupportTicket[];
  accountInfo: AccountInfo[];
  customerSegments: CustomerSegment[];
  analytics: number[];
};

export const fetchDashboard = async (username: string) => {
  const response = await fetch(
    `${ADMIN_API_URL}/dashboard?username=${encodeURIComponent(username)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to load admin dashboard data.");
  }

  return (await response.json()) as AdminDashboardResponse;
};

export const fetchUsers = async (query = "") => {
  const url = query.trim()
    ? `${ADMIN_API_URL}/users?query=${encodeURIComponent(query.trim())}`
    : `${ADMIN_API_URL}/users`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load users.");
  }

  return (await response.json()) as AdminUser[];
};
