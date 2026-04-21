import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchBar from "../components/ui/SearchBar";
import { useAuth } from "../store/authStore";

type AdminLayoutProps = { children: ReactNode };

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/admin/orders?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />

      {/* Topbar */}
      <header className="fixed top-0 right-0 left-64 z-30 flex items-center justify-between px-8 h-16 bg-surface/80 backdrop-blur-xl">
        <form onSubmit={handleSearch} className="w-72">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search orders..."
          />
        </form>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">
              notifications
            </button>
          </div>
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right">
              <p className="text-xs font-bold text-on-surface">{user?.name ?? "Admin"}</p>
              <p className="text-[10px] text-secondary/60">Chef de Cuisine</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-fixed text-xs font-bold border border-primary/20">
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="ml-64 pt-16 flex-1">
        <div className="px-10 py-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
