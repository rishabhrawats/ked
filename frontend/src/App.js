import "@/App.css";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import HomePage from "@/pages/HomePage";
import MarketplacePage from "@/pages/MarketplacePage";
import ServicesPage from "@/pages/ServicesPage";
import EntrepreneurProfilePage from "@/pages/EntrepreneurProfilePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import CommunityPage from "@/pages/CommunityPage";
import SpotlightPage from "@/pages/SpotlightPage";
import BulkOrdersPage from "@/pages/BulkOrdersPage";
import SellerOnboardingPage from "@/pages/SellerOnboardingPage";
import AboutPage from "@/pages/AboutPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import { useAuth } from "@/contexts/AuthContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }
  return null;
}

function AppRoutes() {
  const location = useLocation();
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen" />;
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/entrepreneur/:id" element={<EntrepreneurProfilePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/spotlight" element={<SpotlightPage />} />
        <Route path="/bulk-orders" element={<BulkOrdersPage />} />
        <Route path="/seller-onboarding" element={<SellerOnboardingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/auth" replace />}
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter basename={(import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/"}>
      <ScrollToTop />
      <div className="min-h-screen bg-[#FDFBF9]">
        <Header />
        <main>
          <AppRoutes />
        </main>
        <Footer />
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
