import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authApi, type UserProfile } from "@/services/api";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  Shield,
  Users,
  LogOut,
  Trash2,
  Loader2,
  LayoutDashboard,
  UserCog,
  ChevronLeft,
  Menu,
  User,
  Mail,
  Search,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await authApi.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.detail || "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await authApi.deleteUser(id);
      await fetchUsers();
      toast({
        title: "User Deleted",
        description: "The user has been removed.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.detail || "Failed to delete user.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg text-sidebar-foreground">
              AuthPanel
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                item.active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b flex items-center px-4 gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft /> : <Menu />}
          </button>

          <h2 className="font-semibold text-lg">Admin Dashboard</h2>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline text-sm">
              {user?.email}
            </span>
            <span className="badge-admin">Admin</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-4">
              <p>Total Users</p>
              <h2 className="text-2xl font-bold">{users.length}</h2>
            </div>
            <div className="glass-card p-4">
              <p>Admins</p>
              <h2 className="text-2xl font-bold">
                {users.filter((u) => u.role === "admin").length}
              </h2>
            </div>
            <div className="glass-card p-4">
              <p>Users</p>
              <h2 className="text-2xl font-bold">
                {users.filter((u) => u.role === "user").length}
              </h2>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Table */}
          <div className="glass-card overflow-hidden">
            {loading ? (
              <div className="p-6">Loading...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No users found
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td className="text-right">
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={
                            deletingId === u.id || u.id === user?.id
                          }
                          className="text-red-500"
                        >
                          {deletingId === u.id ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : u.id === user?.id ? (
                            "You"
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;