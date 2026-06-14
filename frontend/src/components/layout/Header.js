import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Marketplace", path: "/marketplace" },
  { label: "Services", path: "/services" },
  { label: "Community", path: "/community" },
  { label: "Spotlight", path: "/spotlight" },
  { label: "Bulk Orders", path: "/bulk-orders" },
  { label: "About", path: "/about" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 ked-glass" data-testid="main-header">
      <div className="ked-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
            <span className="font-serif text-2xl md:text-3xl font-semibold text-ked-text tracking-tight">
              KED
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-ked-text-muted font-sans font-medium leading-tight">
              Kutch<br />Entrepreneur<br />Divas
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-sans font-medium transition-colors duration-200 relative ${
                  location.pathname === link.path
                    ? "text-ked-primary"
                    : "text-ked-text-muted hover:text-ked-text"
                }`}
                data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-ked-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="hidden md:flex items-center gap-2 bg-ked-primary text-white rounded-full px-5 py-2 text-sm font-sans font-medium hover:bg-ked-primary-hover transition-colors"
              data-testid="auth-button"
            >
              <User className="w-4 h-4" />
              {user ? "Dashboard" : "Join KED"}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-ked-accent/50 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isOpen ? <X className="w-6 h-6 text-ked-text" /> : <Menu className="w-6 h-6 text-ked-text" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-ked-border"
            data-testid="mobile-menu"
          >
            <nav className="ked-container py-6 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3 px-4 rounded-xl text-base font-sans font-medium transition-colors ${
                      location.pathname === link.path
                        ? "bg-ked-accent text-ked-text"
                        : "text-ked-text-muted hover:bg-ked-surface"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                to={user ? "/dashboard" : "/auth"}
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 bg-ked-primary text-white rounded-full px-5 py-3 text-sm font-sans font-medium"
                data-testid="mobile-auth-button"
              >
                <User className="w-4 h-4" />
                {user ? "Dashboard" : "Join KED"}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
