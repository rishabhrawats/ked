import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Video, MapPin, Calendar, Users, BadgeCheck, MessageCircle, Phone } from "lucide-react";
import { TrustBadge } from "@/components/shared/TrustBadge";
import PageTransition from "@/components/layout/PageTransition";
import { services } from "@/data/mockData";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const service = services.find((s) => s.id === id) || services[0];

  return (
    <PageTransition>
      <div className="pt-24 pb-20 lg:pb-12" data-testid="service-detail-page">
        <div className="ked-container">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-sans text-ked-text-muted hover:text-ked-text transition-colors mb-6"
            data-testid="service-breadcrumb-back"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="md:col-span-3">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-ked-accent text-ked-text-body text-xs font-sans font-medium px-3 py-1 rounded-full">{service.type}</span>
                  <span className="bg-ked-accent text-ked-text-body text-xs font-sans font-medium px-3 py-1 rounded-full">{service.category}</span>
                  {service.isOnline ? (
                    <span className="flex items-center gap-1 text-xs font-sans text-ked-success">
                      <Video className="w-3.5 h-3.5" /> Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-sans text-ked-text-muted">
                      <MapPin className="w-3.5 h-3.5" /> In-Person
                    </span>
                  )}
                </div>

                <h1 className="font-serif text-3xl md:text-4xl text-ked-text mb-4">{service.name}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < Math.floor(service.rating) ? "fill-amber-400 text-amber-400" : "text-ked-border"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-sans text-ked-text-muted">{service.rating} ({service.reviews} reviews)</span>
                </div>

                <p className="font-sans text-base text-ked-text-body leading-relaxed mb-8">{service.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-xs font-sans font-medium bg-ked-accent text-ked-text-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>

                {/* Session Details */}
                <div className="bg-[#FAF8F5] border border-ked-border rounded-2xl p-6 mb-8">
                  <h3 className="font-sans text-base font-semibold text-ked-text mb-4">Session Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-ked-primary" />
                      <div>
                        <p className="text-xs font-sans text-ked-text-muted">Duration</p>
                        <p className="text-sm font-sans font-medium text-ked-text">{service.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-ked-primary" />
                      <div>
                        <p className="text-xs font-sans text-ked-text-muted">Pricing</p>
                        <p className="text-sm font-sans font-medium text-ked-text">₹{service.price.toLocaleString()} {service.priceType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Available Slots */}
                <div className="mb-8">
                  <h3 className="font-sans text-base font-semibold text-ked-text mb-4">Available Slots</h3>
                  <div className="flex flex-wrap gap-3">
                    {service.slots.map((slot) => (
                      <button
                        key={slot}
                        className="px-4 py-2 border border-ked-border rounded-xl font-sans text-sm text-ked-text hover:bg-ked-accent hover:border-ked-primary/30 transition-all"
                        data-testid={`slot-${slot.replace(/\s/g, "-").toLowerCase()}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-2">
              <div className="sticky top-24 space-y-6">
                {/* Booking Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border border-ked-border rounded-2xl p-6"
                >
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-sans text-3xl font-semibold text-ked-text">₹{service.price.toLocaleString()}</span>
                    <span className="text-sm font-sans text-ked-text-muted">{service.priceType}</span>
                  </div>
                  <button
                    className="w-full flex items-center justify-center gap-2 bg-ked-primary text-white rounded-full py-3.5 font-sans font-medium hover:bg-ked-primary-hover transition-all mb-3"
                    data-testid="book-now-btn"
                  >
                    Book Now
                  </button>
                  <button
                    className="w-full flex items-center justify-center gap-2 border border-ked-border text-ked-text rounded-full py-3 font-sans font-medium hover:bg-ked-surface transition-all"
                    data-testid="service-inquiry-btn"
                  >
                    <MessageCircle className="w-4 h-4" /> Send Inquiry
                  </button>
                </motion.div>

                {/* Provider Card */}
                <div className="bg-[#FAF8F5] border border-ked-border rounded-2xl p-6">
                  <h3 className="font-sans text-xs uppercase tracking-[0.15em] font-medium text-ked-text-muted mb-4">Service Provider</h3>
                  <Link
                    to={`/entrepreneur/${service.provider.id}`}
                    className="group flex items-center gap-3 mb-4"
                    data-testid="service-provider-link"
                  >
                    <img src={service.provider.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-sans text-sm font-medium text-ked-text group-hover:text-ked-primary transition-colors">{service.provider.name}</p>
                      <p className="text-xs font-sans text-ked-text-muted">{service.provider.business}</p>
                    </div>
                    {service.provider.verified && <BadgeCheck className="w-5 h-5 text-ked-success ml-auto" />}
                  </Link>
                  <p className="font-sans text-xs text-ked-text-muted mb-3 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {service.provider.location}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.provider.badges.slice(0, 3).map((badge) => (
                      <TrustBadge key={badge} badge={badge} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
