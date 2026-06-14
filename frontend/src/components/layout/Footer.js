import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { usePublicData } from "@/contexts/PublicDataContext";

export default function Footer() {
  const { settings } = usePublicData();
  const supportEmail = settings.support_email || "hello@ked.in";
  const supportPhone = settings.support_phone || "+91 98765 43210";
  const whatsapp = (settings.default_whatsapp || supportPhone).replace(/[^\d+]/g, "");

  return (
    <footer className="bg-[#2C2A29] text-white/80" data-testid="main-footer">
      {settings.announcement && (
        <div className="border-b border-white/10 bg-ked-primary px-4 py-3 text-center font-sans text-sm font-medium text-white" data-testid="public-announcement">
          {settings.announcement}
        </div>
      )}
      {/* CTA Section */}
      <div className="ked-container py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-tight">
            Ready to grow your business with KED?
          </h2>
          <p className="font-sans text-base text-white/60 mb-10 max-w-xl mx-auto">
            Join thousands of women entrepreneurs who are building, selling, and growing with trust.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/seller-onboarding"
              className="bg-ked-primary text-white rounded-full px-8 py-3.5 font-sans font-medium hover:bg-ked-primary-hover transition-all flex items-center gap-2"
              data-testid="footer-seller-cta"
            >
              Start Selling <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/marketplace"
              className="border border-white/20 text-white rounded-full px-8 py-3.5 font-sans font-medium hover:bg-white/10 transition-all"
              data-testid="footer-explore-cta"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="border-t border-white/10">
        <div className="ked-container py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div>
              <h3 className="font-serif text-xl text-white mb-5">KED</h3>
              <p className="font-sans text-sm text-white/50 leading-relaxed mb-4">
                India's First Platform To Empower Women Entrepreneurs With Structured Growth
              </p>
              <div className="flex items-center gap-3">
                <a href={`mailto:${supportEmail}`} aria-label="Email KED support" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" data-testid="footer-email">
                  <Mail className="w-4 h-4" />
                </a>
                <a href={`https://wa.me/${whatsapp.replace("+", "")}`} aria-label="Contact KED on WhatsApp" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" data-testid="footer-phone">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-sans text-xs uppercase tracking-[0.15em] font-medium text-white/40 mb-5">Platform</h4>
              <div className="flex flex-col gap-3">
                <Link to="/marketplace" className="font-sans text-sm text-white/60 hover:text-white transition-colors">Marketplace</Link>
                <Link to="/services" className="font-sans text-sm text-white/60 hover:text-white transition-colors">Services</Link>
                <Link to="/bulk-orders" className="font-sans text-sm text-white/60 hover:text-white transition-colors">Bulk Orders</Link>
                <Link to="/community" className="font-sans text-sm text-white/60 hover:text-white transition-colors">Community</Link>
              </div>
            </div>

            <div>
              <h4 className="font-sans text-xs uppercase tracking-[0.15em] font-medium text-white/40 mb-5">For Sellers</h4>
              <div className="flex flex-col gap-3">
                <Link to="/seller-onboarding" className="font-sans text-sm text-white/60 hover:text-white transition-colors">Start Selling</Link>
                <Link to="/community" className="font-sans text-sm text-white/60 hover:text-white transition-colors">Workshops</Link>
                <Link to="/spotlight" className="font-sans text-sm text-white/60 hover:text-white transition-colors">Success Stories</Link>
                <Link to="/about" className="font-sans text-sm text-white/60 hover:text-white transition-colors">Support</Link>
              </div>
            </div>

            <div>
              <h4 className="font-sans text-xs uppercase tracking-[0.15em] font-medium text-white/40 mb-5">Connect</h4>
              <div className="flex flex-col gap-3">
                <span className="font-sans text-sm text-white/60 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-ked-primary" /> Bhuj, Kutch, Gujarat
                </span>
                <a href={`mailto:${supportEmail}`} className="font-sans text-sm text-white/60 hover:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-ked-primary" /> {supportEmail}
                </a>
                <a href={`tel:${supportPhone.replace(/[^\d+]/g, "")}`} className="font-sans text-sm text-white/60 hover:text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-ked-primary" /> {supportPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="ked-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-white/40">
            2026 Kutch Entrepreneur Divas. Built with <Heart className="w-3 h-3 inline text-ked-primary" /> for women entrepreneurs.
          </p>
        </div>
      </div>
    </footer>
  );
}
