import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Loader2,
  ArrowRight,
  Shield,
} from "lucide-react";

const RegisterPage = () => {
  const { register, isAuthenticated, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  // Redirect if logged in
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

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!username.trim()) newErrors.username = "Username is required";
    else if (username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await register(email, username, password); // 🔥 always user
    } catch {
      // handled in hook
    } finally {
      setLoading(false);
    }
  };

  // Loader
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
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">
            Create your account
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Join as a user and get started
          </p>

          {/* 🔥 FORM */}
          <form
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

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Username
              </label>

              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <input
                  type="text"
                  name="new-username" // 🔥 important
                  autoComplete="off"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      username: undefined,
                    }));
                  }}
                  placeholder="johndoe"
                  className="input-glass pl-11"
                />
              </div>

              {errors.username && (
                <p className="text-destructive text-xs mt-1.5">
                  {errors.username}
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
                  type="password"
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
                  className="input-glass pl-11"
                />
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
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;