import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";

const inputClass =
  "w-full rounded-lg border border-ink/15 dark:border-parchment/15 bg-paper-surface dark:bg-charcoal-surface px-3.5 py-2.5 text-sm outline-none focus:border-forest dark:focus:border-brass-light transition-colors";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from =
    (location.state as { from?: string } | null)?.from || "/books";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setSubmitting(true);

    try {
      await login(email.trim(), password);
      showToast("Welcome back to BookVerse!");
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-md items-center px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full rounded-2xl border border-ink/10 bg-paper-surface/90 p-6 shadow-dreamy backdrop-blur sm:p-8 dark:border-parchment/10 dark:bg-charcoal-surface/90"
      >
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-rose to-lavender text-white shadow-dreamy">
            <LogIn className="h-5 w-5" />
          </div>

          <h1 className="mt-5 font-display text-3xl font-semibold">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-ink-muted dark:text-parchment/60">
            Sign in to manage your BookVerse account.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium"
            >
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`${inputClass} pr-11`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink dark:text-parchment/60 dark:hover:text-parchment"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gradient-to-r from-rose to-lavender px-6 py-2.5 text-sm font-medium text-white transition-colors hover:from-rose-dark hover:to-lavender disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted dark:text-parchment/60">
          <Link
            to="/books"
            className="font-medium text-forest hover:underline dark:text-brass-light"
          >
            Continue browsing books
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
