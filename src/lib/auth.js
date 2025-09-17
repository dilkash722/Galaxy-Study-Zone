// Simple fixed admin login (demo purposes)
export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("loggedIn") === "true";
}

export function loginAdmin() {
  localStorage.setItem("loggedIn", "true");
}

export function logoutAdmin() {
  localStorage.removeItem("loggedIn");
}
