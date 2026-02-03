const TOKEN_KEY = "voloreis_token";
const ROLE_KEY = "voloreis_role";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession({ token, role }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY); // "customer" | "admin"
}