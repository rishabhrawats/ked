import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, Users, BookOpen, ArrowRight, Video, Award, Lightbulb, Target, TrendingUp } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import PageTransition from "@/components/layout/PageTransition";
import { workshops } from "@/data/mockData";

const learningPaths = [
  { icon: Target, title: "Business Basics", desc: "Pricing, accounting, legal compliance, and getting started.", count: "8 resources" },
  { icon: TrendingUp, title: "Marketing & Growth", desc: "Social media, branding, customer acquisition, and retention.", count: "12 resources" },
  { icon: Lightbulb, title: "Product Development", desc: "Design thinking, prototyping, quality, and sourcing.", count: "6 resources" },
  { icon: Award, title: "Leadership & Mindset", desc: "Confidence building, negotiation, and women's leadership.", count: "10 resources" },
];

const communityEvents = [
  {
    title: "KED Monthly Meetup - Ahmedabad",
    date: "Feb 28, 2026",
    type: "In-Person",
    description: "Network with 50+ women entrepreneurs. Share stories, find collaborators, and grow together.",
  },
  {
    title: "Seller Success Stories Live",
    date: "Mar 5, 2026",
    type: "Online",
    description: "Hear from KED's top sellers about how they scaled their businesses on the platform.",
  },
  {
    title: "Kutch Craft Festival 2026",
    date: "Mar 15-17, 2026",
    type: "In-Person",
    description: "KED's annual celebration of women artisans. Exhibition, workshops, and B2B connections.",
  },
];

export default function CommunityPage() {
  return (
    <PageTransition>
      <div className="pt-24 pb-20 lg:pb-12" data-testid="community-page">
        {/* Hero */}
        <div className="ked-container mb-16">
          <SectionHeading
            label="Community & Learning"
            title="Grow With KED"
            subtitle="Workshops, mentorship, events, and resources designed to help you build a thriving business."
          />
        </div>

        {/* Workshops */}
        <section className="ked-section bg-[#FAF8F5]" data-testid="community-workshops">
          <div className="ked-container">
            <SectionHeading label="Upcoming" title="Workshops & Masterclasses" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {workshops.map((ws, i) => (
                <motion.div
                  key={ws.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-ked-border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={ws.image} alt={ws.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-sans font-semibold text-ked-primary">{ws.type}</span>
                      <span className="text-[10px] font-sans text-ked-text-muted">by {ws.instructor}</span>
                    </div>
                    <h3 className="font-sans text-sm font-medium text-ked-text mb-2 line-clamp-2">{ws.title}</h3>
                    <div className="flex items-center gap-2 text-xs font-sans text-ked-text-muted mb-3">
                      <Calendar className="w-3.5 h-3.5" /> {ws.date} · {ws.time}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-ked-border">
                      <span className="font-sans text-sm font-semibold text-ked-text">
                        {ws.price === 0 ? "Free" : `₹${ws.price}`}
                      </span>
                      <button
                        className="text-xs font-sans font-medium text-ked-primary hover:text-ked-primary-hover transition-colors"
                        data-testid={`register-ws-${ws.id}`}
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Paths */}
        <section className="ked-section" data-testid="learning-paths">
          <div className="ked-container">
            <SectionHeading
              label="Self-Paced Learning"
              title="Learning Paths"
              subtitle="Structured resources to help you at every stage of your entrepreneurial journey."
            />
            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
              {learningPaths.map((path, i) => {
                const Icon = path.icon;
                return (
                  <motion.div
                    key={path.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 bg-[#FAF8F5] border border-ked-border rounded-2xl p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-ked-accent flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-ked-primary" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-ked-text">{path.title}</h3>
                      <p className="font-sans text-xs text-ked-text-muted mt-1">{path.desc}</p>
                      <span className="font-sans text-[10px] text-ked-primary font-medium mt-2 block">{path.count}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Community Events */}
        <section className="ked-section bg-[#FAF8F5]" data-testid="community-events">
          <div className="ked-container">
            <SectionHeading label="Events" title="Community Gatherings" />
            <div className="space-y-4 max-w-3xl">
              {communityEvents.map((event, i) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-ked-border rounded-2xl p-5 hover:shadow-md transition-all"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-ked-accent rounded-xl flex flex-col items-center justify-center">
                    <Calendar className="w-5 h-5 text-ked-primary mb-1" />
                    <span className="text-[10px] font-sans font-medium text-ked-text-muted">{event.type}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sans text-sm font-semibold text-ked-text">{event.title}</h3>
                    <p className="font-sans text-xs text-ked-text-muted mt-0.5">{event.date}</p>
                    <p className="font-sans text-xs text-ked-text-body mt-1">{event.description}</p>
                  </div>
                  <button
                    className="text-sm font-sans font-medium text-ked-primary hover:text-ked-primary-hover transition-colors whitespace-nowrap"
                    data-testid={`rsvp-event-${i}`}
                  >
                    RSVP
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mentorship CTA */}
        <section className="ked-section" data-testid="mentorship-section">
          <div className="ked-container">
            <div className="bg-ked-accent rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
              <Users className="w-10 h-10 text-ked-primary mx-auto mb-4" />
              <h2 className="font-serif text-3xl text-ked-text mb-3">KED Mentorship Program</h2>
              <p className="font-sans text-sm text-ked-text-muted mb-6 max-w-lg mx-auto">
                Get matched with experienced women entrepreneurs who will guide you through the challenges of building your business. Free for all KED members.
              </p>
              <button
                className="bg-ked-primary text-white rounded-full px-8 py-3 font-sans font-medium hover:bg-ked-primary-hover transition-all"
                data-testid="mentorship-cta"
              >
                Apply for Mentorship
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
