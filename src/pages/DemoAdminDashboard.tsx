import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  Shield, Users, LogOut, Trash2,
  LayoutDashboard, UserCog, ChevronLeft, Menu,
  User, Mail,
} from "lucide-react";

const demoUser = { id: 1, email: "admin@example.com", username: "admin", role: "admin" as const };

const initialUsers = [
  { id: 1, email: "admin@example.com", username: "admin", role: "admin" as const },
  { id: 2, email: "john@example.com", username: "johndoe", role: "user" as const },
  { id: 3, email: "jane@example.com", username: "janedoe", role: "user" as const },
  { id: 4, email: "sarah@example.com", username: "sarahm", role: "admin" as const },
  { id: 5, email: "mike@example.com", username: "mikeross", role: "user" as const },
];

const DemoAdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({ title: "User Deleted", description: "The user has been removed." });
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Users, label: "Users", active: false },
    { icon: UserCog, label: "Roles", active: false },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 lg:w-16"
        } overflow-hidden`}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg text-sidebar-foreground whitespace-nowrap">
              AuthPanel
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Exit Demo</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>

          <h2 className="font-semibold text-foreground text-lg">Admin Dashboard</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning font-medium">Demo</span>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-muted-foreground">{demoUser.email}</span>
            <span className="badge-admin">Admin</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Users", value: users.length, icon: Users, color: "text-primary" },
                { label: "Admins", value: users.filter((u) => u.role === "admin").length, icon: Shield, color: "text-accent" },
                { label: "Regular Users", value: users.filter((u) => u.role === "user").length, icon: User, color: "text-info" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color} opacity-60`} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Users Table */}
            <div className="glass-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">All Users</h3>
                <p className="text-sm text-muted-foreground">Manage user accounts and roles</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((u, idx) => (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground ${u.role === "admin" ? "gradient-accent" : "gradient-primary"}`}>
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-foreground">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            {u.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={u.role === "admin" ? "badge-admin" : "badge-user"}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DemoAdminDashboard;
