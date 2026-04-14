import { useState } from "react";
import { Search } from "lucide-react";
import ServiceCard from "@/components/shared/ServiceCard";
import SectionHeading from "@/components/shared/SectionHeading";
import PageTransition from "@/components/layout/PageTransition";
import { services } from "@/data/mockData";

const serviceTypes = ["All", "Workshop", "Weekly Class", "Course", "Consultation"];

export default function ServicesPage() {
  const [activeType, setActiveType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = services.filter((s) => {
    const matchType = activeType === "All" || s.type === activeType;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <PageTransition>
      <div className="pt-24 pb-20 lg:pb-12" data-testid="services-page">
        <div className="ked-container">
          <SectionHeading
            label="Services"
            title="Book Expert Sessions"
            subtitle="From wellness to business consulting, find services offered by talented women professionals."
          />

          {/* Search */}
          <div className="relative max-w-xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ked-text-muted" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30 transition-all"
              data-testid="services-search"
            />
          </div>

          {/* Type Filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8" data-testid="service-type-chips">
            {serviceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`whitespace-nowrap px-5 py-2 rounded-full font-sans text-sm font-medium transition-all ${
                  activeType === type
                    ? "bg-ked-primary text-white"
                    : "bg-[#FAF8F5] border border-ked-border text-ked-text-muted hover:bg-ked-accent"
                }`}
                data-testid={`service-type-${type.toLowerCase().replace(/\s/g, "-")}`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-ked-text mb-2">No services found</p>
              <p className="font-sans text-sm text-ked-text-muted">Try a different search or filter.</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
