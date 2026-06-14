import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Briefcase, GraduationCap, Users, TrendingUp, Package, Star, Sparkles, ChevronRight, Play, BadgeCheck, Calendar } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import ServiceCard from "@/components/shared/ServiceCard";
import FounderCard from "@/components/shared/FounderCard";
import { TrustStrip } from "@/components/shared/TrustBadge";
import { trustStats, howItWorks, testimonials, IMAGES, spotlightStories as fallbackStories } from "@/data/mockData";
import PageTransition from "@/components/layout/PageTransition";
import { usePublicData } from "@/contexts/PublicDataContext";
import { formatDisplayDate } from "@/lib/utils";

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" data-testid="hero-section">
      {/* Soft decorative shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-ked-accent/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-ked-secondary/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ked-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="ked-container relative z-10 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 bg-ked-accent rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-ked-text-body mb-6">
              <Sparkles className="w-3.5 h-3.5 text-ked-primary" />
              Women-First Ecosystem
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-ked-text leading-[1.05] tracking-tight mb-6">
              India's First Platform To Empower Women Entrepreneurs
            </h1>
            <p className="font-sans text-base md:text-lg text-ked-text-muted leading-relaxed mb-8 max-w-lg">
              Sell products. Offer services. Build visibility. Learn, grow, and earn with a trusted ecosystem built by women, for women.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 bg-ked-primary text-white rounded-full px-7 py-3.5 font-sans font-medium hover:bg-ked-primary-hover transition-all hover:shadow-lg hover:shadow-ked-primary/20"
                data-testid="hero-cta-explore"
              >
                Explore Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/seller-onboarding"
                className="inline-flex items-center gap-2 border border-ked-border text-ked-text rounded-full px-7 py-3.5 font-sans font-medium hover:bg-ked-surface transition-all"
                data-testid="hero-cta-sell"
              >
                Start Selling
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-ked-border">
              {trustStats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-2xl md:text-3xl font-semibold text-ked-text">{stat.value}</p>
                  <p className="text-xs font-sans text-ked-text-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                <img src={IMAGES.founders[0]} alt="Woman entrepreneur" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square bg-ked-accent p-6 flex flex-col justify-end">
                <p className="font-serif text-2xl text-ked-text italic leading-snug">
                  "KED helped me reach customers across India"
                </p>
                <p className="font-sans text-xs text-ked-text-muted mt-3">- Priya, Kutch Kala Creations</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                <img src={IMAGES.products[0]} alt="Handmade product" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                <img src={IMAGES.founders[2]} alt="Artisan at work" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturedBusinessesSection({ founders }) {
  return (
    <section className="ked-section" data-testid="featured-businesses-section">
      <div className="ked-container">
        <SectionHeading
          label="Featured"
          title="Women-Led Businesses"
          subtitle="Discover verified women entrepreneurs building incredible brands across India."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {founders.slice(0, 4).map((founder, i) => (
            <FounderCard key={founder.id} founder={founder} index={i} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-sans font-medium text-ked-primary hover:gap-3 transition-all"
            data-testid="view-all-businesses"
          >
            View All Entrepreneurs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductsSection({ products }) {
  return (
    <section className="ked-section bg-[#FAF8F5]" data-testid="products-section">
      <div className="ked-container">
        <div className="flex items-end justify-between mb-10">
          <SectionHeading
            label="Marketplace"
            title="Trending Products"
            subtitle="Handpicked products from verified women-led brands."
          />
          <Link
            to="/marketplace"
            className="hidden md:inline-flex items-center gap-2 text-sm font-sans font-medium text-ked-primary hover:gap-3 transition-all whitespace-nowrap mb-10"
            data-testid="view-all-products"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ services }) {
  return (
    <section className="ked-section" data-testid="services-section">
      <div className="ked-container">
        <SectionHeading
          label="Services"
          title="Book Expert Sessions"
          subtitle="From wellness to business consulting, find services offered by talented women professionals."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 3).map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-sans font-medium text-ked-primary hover:gap-3 transition-all"
            data-testid="view-all-services"
          >
            Explore All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SpotlightSection({ spotlightStories }) {
  const featured = spotlightStories[0];
  return (
    <section className="ked-section bg-[#FAF8F5]" data-testid="spotlight-section">
      <div className="ked-container">
        <SectionHeading
          label="KED Spotlight"
          title="Success Stories"
          subtitle="Celebrating women who are turning dreams into thriving businesses."
        />
        <div className="grid md:grid-cols-12 gap-6">
          {/* Featured Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <Link
              to="/spotlight"
              className="group block bg-white border border-ked-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              data-testid="featured-story"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={featured.founder.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-[0.15em] font-sans font-medium text-ked-primary">
                  Featured Story
                </span>
                <h3 className="font-serif text-2xl text-ked-text mt-2 mb-3">{featured.title}</h3>
                <p className="font-sans text-sm text-ked-text-muted">{featured.excerpt}</p>
                <div className="flex items-center gap-3 mt-4">
                  <img src={featured.founder.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-sans font-medium text-ked-text">{featured.founder.name}</p>
                    <p className="text-[10px] font-sans text-ked-text-muted">{featured.date} · {featured.readTime}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Side Stories */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {spotlightStories.slice(1).map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to="/spotlight"
                  className="group flex gap-4 bg-white border border-ked-border rounded-2xl p-4 hover:shadow-md transition-all duration-300"
                  data-testid={`story-card-${story.id}`}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={story.founder.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans text-sm font-medium text-ked-text line-clamp-2">{story.title}</h4>
                    <p className="text-[10px] font-sans text-ked-text-muted mt-1">{story.date} · {story.readTime}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const icons = [Users, ShoppingBag, TrendingUp];
  return (
    <section className="ked-section" data-testid="how-it-works-section">
      <div className="ked-container">
        <SectionHeading
          label="Simple & Powerful"
          title="How KED Works"
          subtitle="Three simple steps to start your entrepreneurial journey."
          align="center"
        />
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {howItWorks.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-ked-accent flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-ked-primary" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-ked-primary block mb-2">
                  Step {item.step}
                </span>
                <h3 className="font-serif text-xl text-ked-text mb-2">{item.title}</h3>
                <p className="font-sans text-sm text-ked-text-muted">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WorkshopsSection({ workshops }) {
  return (
    <section className="ked-section bg-[#FAF8F5]" data-testid="workshops-section">
      <div className="ked-container">
        <SectionHeading
          label="Learn & Grow"
          title="Upcoming Workshops"
          subtitle="Upskill, learn, and grow with expert-led workshops designed for women entrepreneurs."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workshops.map((ws, i) => (
            <motion.div
              key={ws.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-ked-border rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src={ws.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-sans font-semibold text-ked-primary">{ws.type}</span>
                  <p className="text-[10px] text-ked-text-muted font-sans">{ws.instructor}</p>
                </div>
              </div>
              <h4 className="font-sans text-sm font-medium text-ked-text mb-3 line-clamp-2">{ws.title}</h4>
              <div className="flex items-center gap-2 text-xs font-sans text-ked-text-muted mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDisplayDate(ws.date)}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-ked-border">
                <span className="font-sans text-sm font-semibold text-ked-text">
                  {ws.price === 0 ? "Free" : `₹${ws.price}`}
                </span>
                <span className="text-[10px] font-sans text-ked-text-muted">
                  {ws.spots}/{ws.totalSpots} spots left
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/community"
            className="inline-flex items-center gap-2 text-sm font-sans font-medium text-ked-primary hover:gap-3 transition-all"
            data-testid="view-all-workshops"
          >
            View All Workshops <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyKEDSection() {
  const features = [
    { icon: BadgeCheck, title: "Verified Trust", desc: "Every seller is verified. Every product is curated. Buyers shop with confidence." },
    { icon: TrendingUp, title: "Income Growth", desc: "Not just visibility - actual tools and support to help you earn and grow." },
    { icon: Package, title: "Easy Selling", desc: "List products or services in minutes. No technical skills needed." },
    { icon: GraduationCap, title: "Business Education", desc: "Workshops, mentorship, and resources to build your business smarter." },
    { icon: Users, title: "Community Power", desc: "Connect, collaborate, and grow with a supportive network of women entrepreneurs." },
    { icon: Sparkles, title: "National Discovery", desc: "From your local market to pan-India visibility. KED is your launchpad." },
  ];

  return (
    <section className="ked-section" data-testid="why-ked-section">
      <div className="ked-container">
        <SectionHeading
          label="Why Choose KED"
          title="More Than a Marketplace"
          subtitle="KED is an ecosystem designed for women entrepreneurs to sell, learn, and thrive."
          align="center"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#FAF8F5] border border-ked-border rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-ked-accent flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-ked-primary" />
                </div>
                <h3 className="font-sans text-base font-semibold text-ked-text mb-2">{f.title}</h3>
                <p className="font-sans text-sm text-ked-text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="ked-section bg-[#FAF8F5]" data-testid="testimonials-section">
      <div className="ked-container">
        <SectionHeading
          label="Voices of Trust"
          title="What Our Entrepreneurs Say"
          align="center"
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white border border-ked-border rounded-2xl p-6"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="font-serif text-base text-ked-text-body italic leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-ked-border">
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-sans text-sm font-medium text-ked-text">{t.name}</p>
                  <p className="font-sans text-[10px] text-ked-text-muted">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DailyHighlightsSection({ founders, products, workshops }) {
  const dailyHighlights = {
    featuredBusiness: founders[2] || founders[0],
    todaysOffers: products.slice(0, 3),
    upcomingWorkshops: workshops.slice(0, 2),
  };
  if (!dailyHighlights.featuredBusiness) return null;
  return (
    <section className="ked-section" data-testid="daily-highlights-section">
      <div className="ked-container">
        <SectionHeading
          label="Today on KED"
          title="Fresh Picks & Daily Highlights"
          subtitle="New launches, trending products, and today's special offers."
        />
        <div className="grid md:grid-cols-12 gap-6">
          {/* Featured Business */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-ked-accent rounded-2xl p-6 h-full flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-ked-primary block mb-4">
                  Featured Business Today
                </span>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={dailyHighlights.featuredBusiness.image}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-serif text-xl text-ked-text">{dailyHighlights.featuredBusiness.business}</h3>
                    <p className="text-xs font-sans text-ked-text-muted">{dailyHighlights.featuredBusiness.tagline}</p>
                  </div>
                </div>
                <p className="font-sans text-sm text-ked-text-body leading-relaxed">
                  {dailyHighlights.featuredBusiness.story}
                </p>
              </div>
              <Link
                to={`/entrepreneur/${dailyHighlights.featuredBusiness.id}`}
                className="inline-flex items-center gap-2 text-sm font-sans font-medium text-ked-primary mt-6 hover:gap-3 transition-all"
                data-testid="featured-business-link"
              >
                Visit Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Today's Offers */}
          <div className="md:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-ked-text-muted block mb-4">
              Today's Offers
            </span>
            <div className="grid grid-cols-3 gap-4">
              {dailyHighlights.todaysOffers.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block bg-[#FAF8F5] border border-ked-border rounded-2xl overflow-hidden hover:shadow-md transition-all"
                  data-testid={`daily-offer-${p.id}`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-sans font-medium text-ked-text line-clamp-1">{p.name}</p>
                    <p className="text-sm font-sans font-semibold text-ked-text mt-1">₹{p.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>

            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-ked-text-muted block mt-6 mb-4">
              Upcoming Workshops
            </span>
            <div className="grid grid-cols-2 gap-4">
              {dailyHighlights.upcomingWorkshops.map((ws) => (
                <Link
                  key={ws.id}
                  to="/community"
                  className="flex items-center gap-3 bg-[#FAF8F5] border border-ked-border rounded-xl p-3 hover:shadow-sm transition-all"
                  data-testid={`upcoming-ws-${ws.id}`}
                >
                  <Calendar className="w-8 h-8 text-ked-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs font-sans font-medium text-ked-text line-clamp-1">{ws.title}</p>
                    <p className="text-[10px] font-sans text-ked-text-muted">{formatDisplayDate(ws.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { products, services, founders, posts, workshops } = usePublicData();
  const spotlightStories = posts.length ? posts : fallbackStories;
  return (
    <PageTransition>
      <HeroSection />
      <TrustStrip />
      <DailyHighlightsSection founders={founders} products={products} workshops={workshops} />
      <FeaturedBusinessesSection founders={founders} />
      <ProductsSection products={products} />
      <ServicesSection services={services} />
      <SpotlightSection spotlightStories={spotlightStories} />
      <HowItWorksSection />
      <WhyKEDSection />
      <WorkshopsSection workshops={workshops} />
      <TestimonialsSection />
    </PageTransition>
  );
}
