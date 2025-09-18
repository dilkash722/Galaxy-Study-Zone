// lib/auth.js
export function loginAdmin(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_token", token);
  }
}

export function logoutAdmin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_token");
  }
}

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("admin_token") === "admin-authtoken";
}
