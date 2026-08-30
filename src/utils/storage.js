import { jwtDecode } from "jwt-decode";

const COOKIE_NAME = "JhonnyAdmin";
const STORAGE_KEY = "JhonnyAdmin";

export const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, token);
    document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=604800; SameSite=Lax`;
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    const localToken = localStorage.getItem(STORAGE_KEY);
    if (localToken) return localToken;

    const nameEQ = COOKIE_NAME + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("PharmacyAdmin");
    localStorage.removeItem("drebalAdmin");
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    document.cookie = `PharmacyAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  }
};

export const isTokenValid = (token) => {
  if (!token || typeof token !== "string") return false;
  try {
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};



