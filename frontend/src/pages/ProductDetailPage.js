import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Heart, ShoppingBag, BadgeCheck, MapPin, Truck, Shield, RotateCcw } from "lucide-react";
import { TrustBadge } from "@/components/shared/TrustBadge";
import ProductCard from "@/components/shared/ProductCard";
import PageTransition from "@/components/layout/PageTransition";
import { products } from "@/data/mockData";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <PageTransition>
      <div className="pt-24 pb-20 lg:pb-12" data-testid="product-detail-page">
        <div className="ked-container">
          {/* Breadcrumb */}
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-sans text-ked-text-muted hover:text-ked-text transition-colors mb-6"
            data-testid="breadcrumb-back"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Link>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-ked-primary text-white text-xs px-3 py-1 rounded-full font-sans font-medium">New</span>
                )}
                {discount > 0 && (
                  <span className="bg-[#2C2A29] text-white text-xs px-3 py-1 rounded-full font-sans font-medium">{discount}% Off</span>
                )}
              </div>
              <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors" data-testid="product-wishlist">
                <Heart className="w-5 h-5 text-ked-text-muted" />
              </button>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Seller Info */}
              <Link
                to={`/entrepreneur/${product.seller.id}`}
                className="inline-flex items-center gap-2 mb-4 group"
                data-testid="product-seller-link"
              >
                <img src={product.seller.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-xs font-sans font-medium text-ked-text-muted group-hover:text-ked-primary transition-colors">
                  {product.seller.business}
                </span>
                {product.verified && <BadgeCheck className="w-4 h-4 text-ked-success" />}
              </Link>

              <h1 className="font-serif text-3xl md:text-4xl text-ked-text mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-ked-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-sans text-ked-text-muted">{product.rating} ({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-sans text-3xl font-semibold text-ked-text">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="font-sans text-lg text-ked-text-muted line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="text-sm font-sans font-medium text-ked-success">{discount}% off</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="font-sans text-base text-ked-text-body leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs font-sans font-medium bg-ked-accent text-ked-text-body px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button
                  className="flex-1 flex items-center justify-center gap-2 bg-ked-primary text-white rounded-full py-3.5 font-sans font-medium hover:bg-ked-primary-hover transition-all"
                  data-testid="add-to-cart-btn"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </button>
                <button
                  className="flex items-center justify-center gap-2 border border-ked-border text-ked-text rounded-full px-6 py-3.5 font-sans font-medium hover:bg-ked-surface transition-all"
                  data-testid="buy-now-btn"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 p-5 bg-[#FAF8F5] border border-ked-border rounded-2xl">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-ked-primary" />
                  <span className="text-xs font-sans text-ked-text-muted">Free shipping over ₹999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-ked-primary" />
                  <span className="text-xs font-sans text-ked-text-muted">KED Verified Seller</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-ked-primary" />
                  <span className="text-xs font-sans text-ked-text-muted">Easy returns in 7 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-ked-primary" />
                  <span className="text-xs font-sans text-ked-text-muted">{product.seller.location}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-serif text-2xl text-ked-text mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
