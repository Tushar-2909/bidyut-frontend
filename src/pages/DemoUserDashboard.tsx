import { motion } from "framer-motion";
import { LogOut, Mail, User, Shield, Activity, Clock, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const demoUser = { id: 1, email: "john@example.com", username: "johndoe", role: "user" as const };

const DemoUserDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">AuthPanel</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning font-medium">Demo</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{demoUser.username}</span>
                <span className="badge-user">{demoUser.role}</span>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Exit Demo</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">User Dashboard</h1>
          <p className="text-muted-foreground mb-8">Welcome back, {demoUser.username}!</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 col-span-1 md:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                {demoUser.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">{demoUser.username}</h3>
                <p className="text-sm text-muted-foreground">{demoUser.email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{demoUser.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground capitalize">{demoUser.role}</span>
                <span className="badge-user">{demoUser.role}</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          {[
            { icon: Activity, label: "Account Status", value: "Active", color: "text-success" },
            { icon: Clock, label: "Member Since", value: "March 2026", color: "text-info" },
            { icon: Settings, label: "Settings", value: "Configured", color: "text-accent" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DemoUserDashboard;
