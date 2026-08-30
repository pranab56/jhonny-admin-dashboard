import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from './BaseURL';
import { getToken, removeToken, isTokenValid } from './storage';
import { logout } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${baseURL}/api/v1`,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token && isTokenValid(token)) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const token = getToken();

  // Pre-check if token exists but is expired
  if (token && !isTokenValid(token)) {
    removeToken();
    api.dispatch(logout());
    if (typeof window !== "undefined") {
      toast.error("Session expired, please login again", { id: "session-expired" });
      if (!window.location.pathname.includes("/auth/login")) {
        window.location.href = "/auth/login?reason=expired";
      }
    }
    return {
      error: {
        status: 401,
        data: { message: "Session expired, please login again" },
      },
    };
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  // Global 401 / 403 Unauthorized handling
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    removeToken();
    api.dispatch(logout());
    if (typeof window !== "undefined") {
      toast.error("Session expired, please login again", { id: "session-expired" });
      if (!window.location.pathname.includes("/auth/login")) {
        window.location.href = "/auth/login?reason=expired";
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [],
});

