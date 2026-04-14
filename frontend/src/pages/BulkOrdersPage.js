import { useState } from "react";
import { motion } from "framer-motion";
import { Package, ArrowRight, MessageCircle, BadgeCheck, Factory, Truck, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import PageTransition from "@/components/layout/PageTransition";
import { bulkCategories } from "@/data/mockData";

export default function BulkOrdersPage() {
  const [formData, setFormData] = useState({ name: "", business: "", email: "", phone: "", category: "", quantity: "", message: "" });

  return (
    <PageTransition>
      <div className="pt-24 pb-20 lg:pb-12" data-testid="bulk-orders-page">
        {/* Hero */}
        <div className="ked-container mb-16">
          <SectionHeading
            label="B2B & Bulk Orders"
            title="Wholesale from Women-Led Businesses"
            subtitle="Connect directly with women manufacturers and artisans for bulk orders, custom products, and wholesale pricing."
          />

          {/* Trust Indicators */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mt-8">
            {[
              { icon: Factory, title: "Direct from Makers", desc: "No middlemen. Work directly with women artisans and manufacturers." },
              { icon: Truck, title: "Pan-India Delivery", desc: "Reliable logistics for bulk shipments across India." },
              { icon: ShieldCheck, title: "KED Quality Guarantee", desc: "Every supplier is verified by the KED team." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#FAF8F5] border border-ked-border rounded-2xl p-5"
                >
                  <Icon className="w-8 h-8 text-ked-primary mb-3" />
                  <h3 className="font-sans text-sm font-semibold text-ked-text mb-1">{item.title}</h3>
                  <p className="font-sans text-xs text-ked-text-muted">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <section className="ked-section bg-[#FAF8F5]" data-testid="bulk-categories">
          <div className="ked-container">
            <SectionHeading label="Categories" title="What You Can Source" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bulkCategories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-ked-border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-sans text-base font-semibold text-ked-text mb-2">{cat.title}</h3>
                    <p className="font-sans text-xs text-ked-text-muted mb-4">{cat.description}</p>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-ked-border">
                      <div>
                        <p className="text-[10px] font-sans text-ked-text-muted uppercase tracking-wider">MOQ</p>
                        <p className="text-xs font-sans font-medium text-ked-text">{cat.moq}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-sans text-ked-text-muted uppercase tracking-wider">Lead Time</p>
                        <p className="text-xs font-sans font-medium text-ked-text">{cat.leadTime}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-sans text-ked-text-muted uppercase tracking-wider">Sellers</p>
                        <p className="text-xs font-sans font-medium text-ked-text">{cat.sellers}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section className="ked-section" data-testid="bulk-inquiry-form">
          <div className="ked-container">
            <div className="max-w-2xl mx-auto">
              <SectionHeading
                label="Get Started"
                title="Submit a Bulk Inquiry"
                subtitle="Tell us what you need and we'll connect you with the right women-led suppliers."
                align="center"
              />
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                    data-testid="bulk-name"
                  />
                  <input
                    type="text"
                    placeholder="Business Name"
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                    data-testid="bulk-business"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                    data-testid="bulk-email"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                    data-testid="bulk-phone"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                    data-testid="bulk-category"
                  >
                    <option value="">Select Category</option>
                    {bulkCategories.map((cat) => (
                      <option key={cat.id} value={cat.title}>{cat.title}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Estimated Quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30"
                    data-testid="bulk-quantity"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Describe your requirements (product details, customization needs, timeline...)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-ked-border rounded-xl font-sans text-sm text-ked-text placeholder:text-ked-text-muted/50 focus:outline-none focus:ring-2 focus:ring-ked-primary/30 resize-none"
                  data-testid="bulk-message"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-ked-primary text-white rounded-full py-3.5 font-sans font-medium hover:bg-ked-primary-hover transition-all"
                  data-testid="bulk-submit"
                >
                  <MessageCircle className="w-4 h-4" /> Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
