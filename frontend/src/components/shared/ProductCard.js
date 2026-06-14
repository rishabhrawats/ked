import { Link } from "react-router-dom";
import { Star, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product, index = 0 }) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block bg-[#FAF8F5] border border-ked-border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
        data-testid={`product-card-${product.id}`}
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-ked-primary text-white text-[10px] uppercase tracking-wider font-sans font-semibold px-2.5 py-1 rounded-full">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="bg-[#2C2A29] text-white text-[10px] uppercase tracking-wider font-sans font-semibold px-2.5 py-1 rounded-full">
                {discount}% off
              </span>
            )}
          </div>
          {/* Verified Badge */}
          {product.verified && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-2.5 py-1">
              <BadgeCheck className="w-3.5 h-3.5 text-ked-success" />
              <span className="text-[10px] font-sans font-medium text-ked-text">Verified</span>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-[0.15em] font-sans font-medium text-ked-text-muted mb-1">
            {product.seller.business}
          </p>
          <h3 className="font-sans text-sm font-medium text-ked-text mb-2 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-sans text-base font-semibold text-ked-text">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="font-sans text-xs text-ked-text-muted line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-sans text-ked-text-muted">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
