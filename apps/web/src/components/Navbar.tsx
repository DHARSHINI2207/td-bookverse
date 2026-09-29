import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, LogIn, LogOut, Menu, Search, X } from "lucide-react";

const links = [
  { to: "/books", label: "Books" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/books${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 dark:border-parchment/10 bg-paper/85 dark:bg-charcoal/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-rose to-lavender text-white">
            <BookOpen className="h-[18px] w-[18px]" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            T&amp;D <span className="text-[#741442]">BookVerse</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#741442]"
                    : "text-ink/70 hover:text-ink dark:text-parchment/70 dark:hover:text-parchment"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="relative hidden sm:block">
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  onSubmit={submitSearch}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden"
                >
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search books or authors..."
                    className="w-full rounded-full border border-ink/15 dark:border-parchment/15 bg-paper-surface dark:bg-charcoal-surface py-2 pl-4 pr-4 text-sm outline-none focus:border-forest dark:focus:border-brass-light"
                    onBlur={() => !query && setSearchOpen(false)}
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
              className={`grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5 dark:hover:bg-parchment/10 transition-colors ${
                searchOpen ? "invisible" : ""
              }`}
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
          </div>



          <Link
            to="/books/new"
            className="ml-1 hidden sm:inline-flex rounded-full bg-gradient-to-r from-rose to-lavender px-4 py-2 text-sm font-medium text-white hover:from-rose-dark hover:to-lavender transition-colors"
          >
            Add a book
          </Link>

          {user ? (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="ml-1 hidden sm:inline-flex items-center gap-1.5 rounded-full border border-ink/15 dark:border-parchment/20 px-3.5 py-2 text-sm font-medium hover:border-forest hover:text-forest dark:hover:border-brass-light dark:hover:text-brass-light transition-colors"
              title={isAdmin ? "Administrator" : user.email}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="ml-1 hidden sm:inline-flex items-center gap-1.5 rounded-full border border-ink/15 dark:border-parchment/20 px-3.5 py-2 text-sm font-medium hover:border-forest hover:text-forest dark:hover:border-brass-light dark:hover:text-brass-light transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}

          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5 dark:hover:bg-parchment/10 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ink/10 dark:border-parchment/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-ink/5 dark:hover:bg-parchment/10"
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/books/new"
                onClick={() => setMobileOpen(false)}
                className="mt-1 rounded-full bg-gradient-to-r from-rose to-lavender px-4 py-2.5 text-center text-sm font-medium text-white"
              >
                Add a book
              </Link>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                    navigate("/");
                  }}
                  className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/15 dark:border-parchment/20 px-4 py-2.5 text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/15 dark:border-parchment/20 px-4 py-2.5 text-sm font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
