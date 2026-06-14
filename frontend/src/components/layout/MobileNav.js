import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Briefcase, Users, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const baseTabs = [
  { icon: Home, label: "Home", path: "/" },
  { icon: ShoppingBag, label: "Shop", path: "/marketplace" },
  { icon: Briefcase, label: "Services", path: "/services" },
  { icon: Users, label: "Community", path: "/community" },
];

export default function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();
  const tabs = [...baseTabs, { icon: User, label: user ? "Dashboard" : "Join", path: user ? "/dashboard" : "/auth" }];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-ked-border lg:hidden" data-testid="mobile-bottom-nav">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
                isActive ? "text-ked-primary" : "text-ked-text-muted"
              }`}
              data-testid={`mobile-nav-${tab.label.toLowerCase()}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-sans font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
