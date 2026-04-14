import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import SectionHeading from "@/components/shared/SectionHeading";
import PageTransition from "@/components/layout/PageTransition";
import { products, categories } from "@/data/mockData";

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <PageTransition>
      <div className="pt-24 pb-20 lg:pb-12" data-testid="marketplace-page">
        <div className="ked-container">
          <SectionHeading
            label="Marketplace"
            title="Discover Women-Led Products"
            subtitle="Handpicked, verified, and crafted with love by women entrepreneurs across India."
          />

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8" data-testid="marketplace-filters">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ked-text-muted" />
              <input
                type="text"
                placeholder="Search products, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30 transition-all"
                data-testid="marketplace-search"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 border border-ked-border rounded-xl font-sans text-sm text-ked-text-muted hover:bg-ked-surface transition-colors" data-testid="marketplace-sort">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none" data-testid="category-chips">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`whitespace-nowrap px-5 py-2 rounded-full font-sans text-sm font-medium transition-all ${
                  activeCategory === cat.name
                    ? "bg-ked-primary text-white"
                    : "bg-[#FAF8F5] border border-ked-border text-ked-text-muted hover:bg-ked-accent"
                }`}
                data-testid={`category-${cat.name.toLowerCase().replace(/\s/g, "-")}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Results */}
          <p className="text-xs font-sans text-ked-text-muted mb-6">{filtered.length} products found</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-ked-text mb-2">No products found</p>
              <p className="font-sans text-sm text-ked-text-muted">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
