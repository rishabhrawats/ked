import { motion } from "framer-motion";
import { Heart, Target, Users, Award, TrendingUp, Globe, Shield, Lightbulb, MapPin } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import PageTransition from "@/components/layout/PageTransition";
import { IMAGES, trustStats } from "@/data/mockData";

const values = [
  { icon: Heart, title: "Women First", desc: "Everything we build starts with the question: does this help women entrepreneurs earn and grow?" },
  { icon: Shield, title: "Trust as Foundation", desc: "Every seller is verified. Every product is curated. Every transaction is protected." },
  { icon: TrendingUp, title: "Income, Not Just Visibility", desc: "We don't just showcase. We help women actually sell, earn, and build sustainable businesses." },
  { icon: Globe, title: "Local to National", desc: "We believe a talented artisan from Kutch deserves the same reach as a brand in Mumbai." },
  { icon: Users, title: "Community Power", desc: "Growth happens together. We build connections, collaborations, and collective strength." },
  { icon: Lightbulb, title: "Simplicity Always", desc: "Technology should empower, not intimidate. KED is built for real women, not tech experts." },
];

const team = [
  { name: "The KED Team", role: "Building India's women-first commerce ecosystem", desc: "A passionate team of builders, designers, and community leaders committed to women's economic empowerment." },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="pt-24 pb-20 lg:pb-12" data-testid="about-page">
        {/* Hero */}
        <section className="ked-container mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-ked-primary block mb-4">About KED</span>
              <h1 className="font-serif text-4xl md:text-5xl text-ked-text leading-tight mb-6">
                Empowering Women Entrepreneurs to Build, Sell & Thrive
              </h1>
              <p className="font-sans text-base text-ked-text-muted leading-relaxed mb-6">
                Kutch Entrepreneur Divas (KED) is India's first structured income platform for women entrepreneurs. Born in the heart of Kutch, Gujarat, we are building an ecosystem where women can sell products, offer services, gain visibility, learn business skills, and grow from local talent to nationally recognized brands.
              </p>
              <p className="font-sans text-base text-ked-text-muted leading-relaxed">
                We believe every woman with a skill, a product, or a dream deserves a platform that respects her work, amplifies her voice, and helps her earn with dignity.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={IMAGES.founders[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[3/4] mt-8">
                <img src={IMAGES.founders[2]} alt="" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Impact Numbers */}
        <section className="bg-[#2C2A29] py-16" data-testid="about-impact">
          <div className="ked-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {trustStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="font-serif text-3xl md:text-4xl text-ked-primary font-semibold">{stat.value}</p>
                  <p className="font-sans text-sm text-white/60 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="ked-section" data-testid="about-values">
          <div className="ked-container">
            <SectionHeading
              label="Our Values"
              title="What Drives KED"
              subtitle="The principles that guide everything we build and every decision we make."
              align="center"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-[#FAF8F5] border border-ked-border rounded-2xl p-6"
                  >
                    <div className="w-10 h-10 rounded-xl bg-ked-accent flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-ked-primary" />
                    </div>
                    <h3 className="font-sans text-base font-semibold text-ked-text mb-2">{v.title}</h3>
                    <p className="font-sans text-sm text-ked-text-muted leading-relaxed">{v.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="ked-section bg-ked-accent" data-testid="about-vision">
          <div className="ked-container text-center max-w-3xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-ked-primary block mb-4">Our Vision</span>
            <h2 className="font-serif text-3xl md:text-4xl text-ked-text leading-tight mb-6 italic">
              "To make India the world leader in women-led commerce by enabling every woman entrepreneur to build, sell, and grow with trust and dignity."
            </h2>
            <p className="font-sans text-sm text-ked-text-muted">
              KED started in Kutch, but our vision is national. We are building the infrastructure for women's economic empowerment — one entrepreneur, one product, one community at a time.
            </p>
          </div>
        </section>

        {/* Rooted in Kutch */}
        <section className="ked-section" data-testid="about-kutch">
          <div className="ked-container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <SectionHeading
                  label="Our Roots"
                  title="Born in Kutch, Built for India"
                  subtitle="Kutch is home to some of India's most talented artisans, makers, and entrepreneurs. KED was born from the desire to give these women the platform they deserve."
                />
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-ked-primary mt-0.5" />
                    <div>
                      <p className="font-sans text-sm font-medium text-ked-text">Bhuj, Kutch — Our Headquarters</p>
                      <p className="font-sans text-xs text-ked-text-muted">Where craft meets commerce, and tradition meets technology.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-ked-primary mt-0.5" />
                    <div>
                      <p className="font-sans text-sm font-medium text-ked-text">A Legacy of Craft</p>
                      <p className="font-sans text-xs text-ked-text-muted">Kutch's Bandhani, Rogan art, mirror work, and pottery are recognised worldwide. We bring these to digital marketplaces.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <img src={IMAGES.founders[6]} alt="Kutch artisan" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
