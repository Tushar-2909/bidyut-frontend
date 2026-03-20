import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  Shield,
} from "lucide-react";

const LoginPage = () => {
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user"); // 🔥 role added
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated && user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  // Validation
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await login(email, password, role); // 🔥 role passed
    } catch {
      // handled in hook
    } finally {
      setLoading(false);
    }
  };

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center auth-bg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center auth-bg relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card-dark p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center animate-pulse_ring">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">
            Welcome back
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            Sign in to your account
          </p>

          {/* 🔥 ROLE SELECTOR */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                role === "user"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              User
            </button>

            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                role === "admin"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Admin
            </button>
          </div>

          {/* FORM */}
          <motion.form
            onSubmit={handleSubmit}
            autoComplete="off" // 🔥 disable autofill
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <input
                  type="email"
                  name="new-email" // 🔥 important
                  autoComplete="off"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      email: undefined,
                    }));
                  }}
                  placeholder="you@example.com"
                  className="input-glass pl-11"
                />
              </div>

              {errors.email && (
                <p className="text-destructive text-xs mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="new-password" // 🔥 important
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }}
                  placeholder="••••••••"
                  className="input-glass pl-11 pr-16"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-destructive text-xs mt-1.5">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.form>

          <p className="text-center text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;