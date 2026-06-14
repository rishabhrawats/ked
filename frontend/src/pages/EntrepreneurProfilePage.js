import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, BadgeCheck, Instagram, Phone, MessageCircle, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import ServiceCard from "@/components/shared/ServiceCard";
import { TrustBadge } from "@/components/shared/TrustBadge";
import PageTransition from "@/components/layout/PageTransition";
import { usePublicData } from "@/contexts/PublicDataContext";
import InquiryDialog from "@/components/shared/InquiryDialog";

export default function EntrepreneurProfilePage() {
  const { id } = useParams();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const { founders, products, services } = usePublicData();
  const founder = founders.find((f) => f.id === id);
  if (!founder) {
    return <div className="min-h-screen pt-32 text-center font-serif text-2xl">Seller not found</div>;
  }
  const founderProducts = products.filter((p) => p.seller?.id === founder.id);
  const founderServices = services.filter((s) => s.provider?.id === founder.id);

  return (
    <PageTransition>
      <div className="pt-20 pb-20 lg:pb-12" data-testid="entrepreneur-profile-page">
        {/* Hero Header */}
        <div className="relative">
          <div className="h-48 md:h-64 overflow-hidden">
            <img
              src={founder.image}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.8) blur(2px)", transform: "scale(1.1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FDFBF9]/60 to-[#FDFBF9]" />
          </div>

          <div className="ked-container relative -mt-20">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden shadow-lg flex-shrink-0"
              >
                <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
              </motion.div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="font-serif text-3xl md:text-4xl text-ked-text">{founder.name}</h1>
                  {founder.verified && <BadgeCheck className="w-6 h-6 text-ked-success" />}
                </div>
                <p className="font-serif text-lg text-ked-text-body italic">{founder.business}</p>
                <p className="font-sans text-sm text-ked-text-muted mt-1">{founder.tagline}</p>

                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-sm font-sans text-ked-text-muted">
                    <MapPin className="w-4 h-4" /> {founder.location}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-sans text-ked-text-muted">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {founder.rating} ({founder.reviews} reviews)
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {founder.badges.map((badge) => (
                    <TrustBadge key={badge} badge={badge} size="lg" />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 md:flex-col">
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="flex items-center gap-2 bg-ked-primary text-white rounded-full px-6 py-2.5 font-sans text-sm font-medium hover:bg-ked-primary-hover transition-all"
                  data-testid="profile-inquiry-btn"
                >
                  <MessageCircle className="w-4 h-4" /> Inquire
                </button>
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="flex items-center gap-2 border border-ked-border text-ked-text rounded-full px-6 py-2.5 font-sans text-sm font-medium hover:bg-ked-surface transition-all"
                  data-testid="profile-whatsapp-btn"
                >
                  <Phone className="w-4 h-4" /> WhatsApp
                </button>
                {founder.social.instagram && (
                  <a
                    href="#"
                    className="flex items-center gap-2 border border-ked-border text-ked-text rounded-full px-6 py-2.5 font-sans text-sm font-medium hover:bg-ked-surface transition-all"
                    data-testid="profile-instagram-btn"
                  >
                    <Instagram className="w-4 h-4" /> Follow
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="ked-container mt-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl text-ked-text mb-4">Our Story</h2>
            <p className="font-sans text-base text-ked-text-body leading-relaxed">{founder.story}</p>
          </div>
        </div>

        {/* Products */}
        {founderProducts.length > 0 && (
          <div className="ked-container mt-16">
            <h2 className="font-serif text-2xl text-ked-text mb-6">Products ({founderProducts.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {founderProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        {founderServices.length > 0 && (
          <div className="ked-container mt-16">
            <h2 className="font-serif text-2xl text-ked-text mb-6">Services ({founderServices.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {founderServices.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="ked-container mt-12">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-sans font-medium text-ked-text-muted hover:text-ked-text transition-colors"
            data-testid="back-to-marketplace"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Link>
        </div>
      </div>
      <InquiryDialog entityType="profile" entityId={founder.id} title={founder.business} open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </PageTransition>
  );
}
