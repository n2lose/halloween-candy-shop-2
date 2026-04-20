import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { register as apiRegister } from "../../api/auth";
import Spinner from "../../components/ui/Spinner";

export default function RegisterPage() {
  const { isAuthenticated, loading: authLoading, login, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && isAuthenticated && user) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await apiRegister({ name, email, password });
      login(res.data);
      navigate("/products", { replace: true });
    } catch {
      setError("Registration failed. This email may already be taken.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 atelier-glow pointer-events-none" />

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                dark_mode
              </span>
            </div>
            <h1 className="font-headline text-5xl font-bold italic tracking-tight text-primary">
              Join the Atelier
            </h1>
            <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary mt-2 opacity-80">
              Become a Patron
            </p>
          </div>

          <div className="bg-surface-container-high/80 backdrop-blur-2xl rounded-xl p-10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { id: "name", label: "Your Name", value: name, setter: setName, type: "text", placeholder: "Enter your mortal name", icon: "person" },
                { id: "email", label: "Email", value: email, setter: setEmail, type: "email", placeholder: "Your spirit address", icon: "alternate_email" },
                { id: "password", label: "Password", value: password, setter: setPassword, type: "password", placeholder: "Your secret incantation (6+ chars)", icon: "lock" },
              ].map(({ id, label, value, setter, type, placeholder, icon }) => (
                <div key={id} className="group/input">
                  <label className="block font-label text-xs uppercase tracking-widest text-secondary mb-2 transition-colors group-focus-within/input:text-tertiary">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={type}
                      value={value}
                      onChange={e => setter(e.target.value)}
                      placeholder={placeholder}
                      required
                      className="w-full bg-surface-container-lowest rounded-lg py-4 px-5 text-on-surface
                                 placeholder:text-outline/40 focus:ring-1 focus:ring-tertiary/40 outline-none transition-all"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 text-xl pointer-events-none">
                      {icon}
                    </span>
                  </div>
                </div>
              ))}

              {error && <p className="text-sm text-error text-center">{error}</p>}

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
                    <><Spinner size="sm" /><span className="font-headline text-lg italic">Creating...</span></>
                  ) : (
                    <><span className="font-headline text-lg italic">Create Account</span><span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span></>
                  )}
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-outline-variant/10" />
                <span className="flex-shrink mx-4 font-label text-[10px] uppercase tracking-[0.2em] text-outline/40">Already a patron?</span>
                <div className="flex-grow border-t border-outline-variant/10" />
              </div>

              <div className="text-center">
                <Link to="/login" className="font-label text-xs uppercase tracking-widest text-secondary hover:text-on-surface transition-colors">
                  Sign In Instead
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
