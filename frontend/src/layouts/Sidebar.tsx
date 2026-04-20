import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/orders",    label: "Orders",     icon: "receipt_long" },
  { to: "/admin/products",  label: "Inventory",  icon: "inventory_2" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "??";

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 flex flex-col h-screen w-64 bg-surface-container shadow-2xl shadow-black/50">
      {/* Brand */}
      <div className="p-8">
        <div className="flex flex-col gap-1 mb-10">
          <span className="text-xl font-headline font-bold italic text-primary">
            The Haunted Atelier
          </span>
          <span className="text-[10px] uppercase tracking-widest text-secondary/60 font-label">
            Master Chocolatier
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-4 px-4 py-3 transition-all duration-200 font-label text-sm",
                  isActive
                    ? "text-primary bg-surface-container-high rounded-r-full border-l-4 border-primary font-bold"
                    : "text-secondary hover:text-on-surface hover:bg-surface-container-high rounded-r-full border-l-4 border-transparent",
                ].join(" ")
              }
            >
              <span className="material-symbols-outlined text-xl">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* New Batch CTA */}
        <div className="mt-10 px-2">
          <button
            onClick={() => navigate("/admin/products")}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-container
                       text-on-primary-fixed text-sm font-bold font-label rounded-xl
                       shadow-lg shadow-primary/10 hover:scale-[0.97] active:scale-95 transition-transform"
          >
            New Batch
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-auto p-6 border-t border-white/5 flex flex-col gap-3">
        {/* User info */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-fixed text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-on-surface truncate">{user?.name}</p>
            <p className="text-[10px] text-secondary/60 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Settings & Support */}
        <a href="#" className="flex items-center gap-4 px-4 py-2 text-secondary hover:text-on-surface transition-colors text-sm font-label">
          <span className="material-symbols-outlined text-xl">settings</span>
          Settings
        </a>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-2 text-secondary hover:text-error transition-colors text-sm font-label w-full text-left"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
