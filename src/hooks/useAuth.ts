import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { authApi, type UserProfile } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: "user" | "admin") => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthProvider() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // ------------------------------
  // FETCH PROFILE
  // ------------------------------
  const refreshProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data } = await authApi.getProfile();
      setUser(data);

      localStorage.setItem("role", data.role);
    } catch {
      setUser(null);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // ------------------------------
  // LOGIN (UPDATED 🔥)
  // ------------------------------
  const login = useCallback(
    async (email: string, password: string, role: "user" | "admin") => {
      setLoading(true);

      try {
        // 🔥 Send role to backend
        const { data } = await authApi.login({ email, password, role });

        // Save tokens
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // Fetch profile
        const profileRes = await authApi.getProfile();
        const userData = profileRes.data;

        setUser(userData);
        localStorage.setItem("role", userData.role);

        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });

        // 🔥 Role-based redirect
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }

      } catch (error: any) {
        const msg =
          error.response?.data?.detail ||
          "Invalid credentials or role mismatch.";

        toast({
          title: "Login Failed",
          description: msg,
          variant: "destructive",
        });

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // ------------------------------
  // REGISTER (ONLY USER 🔥)
  // ------------------------------
  const register = useCallback(
    async (email: string, username: string, password: string) => {
      setLoading(true);

      try {
        await authApi.register({
          email,
          username,
          password,
        });

        toast({
          title: "Account Created!",
          description: "Please log in with your credentials.",
        });

        navigate("/login");
      } catch (error: any) {
        const msg =
          error.response?.data?.detail ||
          error.response?.data?.email?.[0] ||
          "Registration failed.";

        toast({
          title: "Registration Failed",
          description: msg,
          variant: "destructive",
        });

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // ------------------------------
  // LOGOUT
  // ------------------------------
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore API failure
    } finally {
      localStorage.clear();
      setUser(null);

      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });

      navigate("/login");
    }
  }, [navigate]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshProfile,
  };
}

// ------------------------------
// HOOK
// ------------------------------
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
