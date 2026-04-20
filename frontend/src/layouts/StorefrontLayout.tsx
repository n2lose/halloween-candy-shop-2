import { ReactNode, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useCart } from "../store/cartStore";
import CartDrawer from "../components/cart/CartDrawer";

type StorefrontLayoutProps = { children: ReactNode };

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Topbar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl flex justify-between items-center px-8 h-20">
        {/* Logo */}
        <Link to="/products" className="text-2xl font-headline italic text-primary hover:text-primary/80 transition-colors">
          The Haunted Atelier
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "text-primary border-b-2 border-primary-container pb-1 font-body font-medium"
                : "text-on-surface/80 hover:text-primary transition-colors font-body font-medium"
            }
          >
            Collections
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive
                  ? "text-primary border-b-2 border-primary-container pb-1 font-body font-medium"
                  : "text-on-surface/80 hover:text-primary transition-colors font-body font-medium"
              }
            >
              My Orders
            </NavLink>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* User */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-secondary/60">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="material-symbols-outlined text-secondary hover:text-error transition-colors"
                title="Logout"
              >
                logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-label text-secondary hover:text-primary transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-20">
        {children}
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
