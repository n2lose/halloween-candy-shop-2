import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { login as apiLogin } from "../../api/auth";
import Spinner from "../../components/ui/Spinner";

export default function LoginPage() {
  const { isAuthenticated, loading: authLoading, login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in — redirect by role
  if (!authLoading && isAuthenticated && user) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/products"} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await apiLogin({ email, password });
      login(res.data);
      navigate(res.data.user.role === "admin" ? "/admin/dashboard" : "/products", { replace: true });
    } catch {
      setError("Invalid credentials. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Atmospheric glow */}
      <div className="fixed inset-0 atelier-glow pointer-events-none" />

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Brand header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                dark_mode
              </span>
            </div>
            <h1 className="font-headline text-5xl font-bold italic tracking-tight text-primary">
              The Haunted Atelier
            </h1>
            <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary mt-2 opacity-80">
              Elite Confectioner
            </p>
          </div>

          {/* Card */}
          <div className="bg-surface-container-high/80 backdrop-blur-2xl rounded-xl p-10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="group/input">
                  <label className="block font-label text-xs uppercase tracking-widest text-secondary mb-2 transition-colors group-focus-within/input:text-tertiary">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your spirit name"
                      required
                      className="w-full bg-surface-container-lowest rounded-lg py-4 px-5 text-on-surface
                                 placeholder:text-outline/40 focus:ring-1 focus:ring-tertiary/40 outline-none transition-all"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 text-xl pointer-events-none">
                      person
                    </span>
                  </div>
                </div>

                <div className="group/input">
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-label text-xs uppercase tracking-widest text-secondary transition-colors group-focus-within/input:text-tertiary">
                      Password
                    </label>
                    <a href="#" className="text-[10px] uppercase tracking-wider text-outline hover:text-primary transition-colors">
                      Forgotten?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Your secret incantation"
                      required
                      className="w-full bg-surface-container-lowest rounded-lg py-4 px-5 text-on-surface
                                 placeholder:text-outline/40 focus:ring-1 focus:ring-tertiary/40 outline-none transition-all"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 text-xl pointer-events-none">
                      lock
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-error text-center -mt-2">{error}</p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed
                             font-bold py-4 rounded-lg flex items-center justify-center gap-2 group
                             shadow-[0_4px_20px_rgba(255,183,131,0.2)]
                             hover:shadow-[0_8px_30px_rgba(255,183,131,0.4)]
                             active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" />
                      <span className="font-headline text-lg italic">Entering...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-headline text-lg italic">Enter the Atelier</span>
                      <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-outline-variant/10" />
                <span className="flex-shrink mx-4 font-label text-[10px] uppercase tracking-[0.2em] text-outline/40">
                  New Patron?
                </span>
                <div className="flex-grow border-t border-outline-variant/10" />
              </div>

              <div className="text-center">
                <Link
                  to="/register"
                  className="font-label text-xs uppercase tracking-widest text-secondary hover:text-on-surface transition-colors"
                >
                  Request an Invitation
                </Link>
              </div>
            </form>

            {/* Decorative background icon */}
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                rebase
              </span>
            </div>
          </div>

          {/* Bottom badges */}
          <div className="mt-12 flex justify-center items-center space-x-8">
            {[
              { icon: "vignette", label: "Artisanal" },
              { icon: "auto_awesome", label: "Premium" },
              { icon: "history_edu", label: "Mystical" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-2xl text-secondary">{icon}</span>
                <span className="font-label text-[10px] uppercase tracking-tighter text-secondary">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-end gap-8">
          {["Privacy", "Terms", "Support"].map(link => (
            <a key={link} href="#" className="font-label text-[10px] uppercase tracking-widest text-outline/60 hover:text-primary transition-colors">
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
