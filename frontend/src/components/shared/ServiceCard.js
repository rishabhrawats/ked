import { Link } from "react-router-dom";
import { Clock, MapPin, Star, Video, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ServiceCard({ service, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link
        to={`/service/${service.id}`}
        className="group block bg-[#FAF8F5] border border-ked-border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
        data-testid={`service-card-${service.id}`}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="bg-white/90 backdrop-blur text-ked-text text-[10px] uppercase tracking-wider font-sans font-semibold px-3 py-1 rounded-full">
              {service.type}
            </span>
            {service.isOnline ? (
              <span className="flex items-center gap-1 bg-white/90 backdrop-blur text-ked-text text-[10px] font-sans font-medium px-2.5 py-1 rounded-full">
                <Video className="w-3 h-3" /> Online
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-white/90 backdrop-blur text-ked-text text-[10px] font-sans font-medium px-2.5 py-1 rounded-full">
                <MapPin className="w-3 h-3" /> In-Person
              </span>
            )}
          </div>
        </div>
        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={service.provider.image}
              alt={service.provider.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-[10px] uppercase tracking-[0.15em] font-sans font-medium text-ked-text-muted">
              {service.provider.name}
            </span>
          </div>
          <h3 className="font-sans text-sm font-medium text-ked-text mb-2 line-clamp-2">
            {service.name}
          </h3>
          <p className="font-sans text-xs text-ked-text-muted mb-3 line-clamp-2">
            {service.description}
          </p>
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center gap-1 text-xs font-sans text-ked-text-muted">
              <Clock className="w-3.5 h-3.5" /> {service.duration}
            </span>
            <span className="flex items-center gap-1 text-xs font-sans text-ked-text-muted">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {service.rating}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-ked-border">
            <div>
              <span className="font-sans text-base font-semibold text-ked-text">
                ₹{service.price.toLocaleString()}
              </span>
              <span className="text-xs text-ked-text-muted font-sans ml-1">
                {service.priceType}
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs font-sans font-medium text-ked-primary group-hover:gap-2 transition-all">
              Book Now <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
