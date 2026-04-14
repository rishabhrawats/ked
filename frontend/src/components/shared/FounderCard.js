import { Link } from "react-router-dom";
import { MapPin, Star, BadgeCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FounderCard({ founder, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link
        to={`/entrepreneur/${founder.id}`}
        className="group block bg-[#FAF8F5] border border-ked-border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
        data-testid={`founder-card-${founder.id}`}
      >
        <div className="relative">
          {/* Background Image */}
          <div className="h-32 overflow-hidden">
            <img
              src={founder.image}
              alt={founder.business}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent" />
          </div>
          {/* Avatar */}
          <div className="absolute -bottom-8 left-4">
            <div className="w-16 h-16 rounded-full border-3 border-[#FAF8F5] overflow-hidden shadow-md">
              <img
                src={founder.image}
                alt={founder.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Trust Badge */}
          {founder.verified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-2.5 py-1">
              <BadgeCheck className="w-3.5 h-3.5 text-ked-success" />
              <span className="text-[10px] font-sans font-medium text-ked-text">KED Verified</span>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="pt-10 pb-4 px-4">
          <h3 className="font-sans text-sm font-semibold text-ked-text">{founder.name}</h3>
          <p className="font-serif text-base text-ked-text-body italic mt-0.5">{founder.business}</p>
          <p className="text-xs text-ked-text-muted font-sans mt-1">{founder.tagline}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-xs text-ked-text-muted font-sans">
              <MapPin className="w-3 h-3" /> {founder.location}
            </span>
            <span className="flex items-center gap-1 text-xs text-ked-text-muted font-sans">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {founder.rating}
            </span>
          </div>
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {founder.badges.slice(0, 3).map((badge) => (
              <span
                key={badge}
                className="text-[10px] font-sans font-medium bg-ked-accent text-ked-text-body px-2 py-0.5 rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-ked-border">
            <div className="flex items-center gap-4 text-xs font-sans text-ked-text-muted">
              <span>{founder.products} Products</span>
              <span>{founder.services} Services</span>
            </div>
            <ArrowRight className="w-4 h-4 text-ked-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
