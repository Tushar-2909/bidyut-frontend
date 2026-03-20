import axios, { AxiosRequestConfig } from "axios";

// ------------------------------
// BASE CONFIG
// ------------------------------
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://bidyut-backend-q1qq.onrender.com"
).replace(/\/+$/, "");

// Main API instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate instance for refresh
const refreshApi = axios.create({
  baseURL: API_BASE_URL,
});

// ------------------------------
// REQUEST INTERCEPTOR
// ------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------
// RESPONSE INTERCEPTOR
// ------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/login/")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await refreshApi.post("/api/refresh/", {
          refresh: refreshToken,
        });

        localStorage.setItem("access_token", data.access);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
        }

        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ------------------------------
// TYPES
// ------------------------------
export interface LoginPayload {
  email: string;
  password: string;
  role: "user" | "admin"; // 🔥 ADDED
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  role: "user" | "admin";
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// ------------------------------
// AUTH API
// ------------------------------
export const authApi = {
  // 🔥 LOGIN UPDATED
  login: (payload: LoginPayload) =>
    api.post<AuthTokens>("/api/login/", payload),

  register: (payload: RegisterPayload) =>
    api.post("/api/register/", payload),

  getProfile: () =>
    api.get<UserProfile>("/api/profile/"),

  logout: async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        await api.post("/api/logout/", { refresh });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.clear();
      window.location.href = "/login";
    }
  },

  deleteUser: (id: number) =>
    api.delete(`/api/delete-user/${id}/`),

  getAllUsers: () =>
    api.get<UserProfile[]>("/api/users/"),
};

export default api;
