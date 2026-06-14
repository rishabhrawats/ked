import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import PageTransition from "@/components/layout/PageTransition";
import { usePublicData } from "@/contexts/PublicDataContext";
import { spotlightStories as fallbackStories } from "@/data/mockData";

export default function SpotlightPage() {
  const { posts, founders } = usePublicData();
  const spotlightStories = posts.length ? posts : fallbackStories;
  return (
    <PageTransition>
      <div className="pt-24 pb-20 lg:pb-12" data-testid="spotlight-page">
        <div className="ked-container">
          <SectionHeading
            label="KED Spotlight"
            title="Stories That Inspire"
            subtitle="Celebrating the journeys of incredible women entrepreneurs — from local beginnings to national recognition."
          />

          {/* Featured Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-2 gap-8 bg-[#FAF8F5] border border-ked-border rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                <img
                  src={spotlightStories[0].founder.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-ked-primary mb-3">Featured Story</span>
                <h2 className="font-serif text-2xl md:text-3xl text-ked-text mb-4 leading-tight">
                  {spotlightStories[0].title}
                </h2>
                <p className="font-sans text-base text-ked-text-muted leading-relaxed mb-6">
                  {spotlightStories[0].excerpt}
                </p>
                <div className="flex items-center gap-3 mb-6">
                  <img src={spotlightStories[0].founder.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-sans font-medium text-ked-text">{spotlightStories[0].founder.name}</p>
                    <p className="text-xs font-sans text-ked-text-muted">{spotlightStories[0].founder.business}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-sans text-ked-text-muted">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {spotlightStories[0].readTime}</span>
                  <span>{spotlightStories[0].date}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* All Stories */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {spotlightStories.slice(1).map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#FAF8F5] border border-ked-border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={story.founder.image} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-5">
                  <h3 className="font-sans text-sm font-medium text-ked-text mb-2 line-clamp-2">{story.title}</h3>
                  <p className="font-sans text-xs text-ked-text-muted line-clamp-2 mb-3">{story.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-ked-border">
                    <div className="flex items-center gap-2">
                      <img src={story.founder.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs font-sans text-ked-text-muted">{story.founder.name}</span>
                    </div>
                    <span className="text-[10px] font-sans text-ked-text-muted">{story.readTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Rising Founders */}
          <SectionHeading
            label="Rising Stars"
            title="Meet the Next Generation"
            subtitle="Emerging women entrepreneurs making waves in their industries."
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {founders.slice(4).map((founder, i) => (
              <motion.div
                key={founder.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/entrepreneur/${founder.id}`}
                  className="group block text-center"
                  data-testid={`rising-star-${founder.id}`}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-ked-accent group-hover:border-ked-primary transition-colors">
                    <img src={founder.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-sans text-sm font-medium text-ked-text">{founder.name}</h4>
                  <p className="text-xs font-sans text-ked-text-muted">{founder.business}</p>
                  <p className="text-[10px] font-sans text-ked-primary mt-1">{founder.location}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="bg-ked-accent rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl text-ked-text mb-3">Share Your Story</h2>
              <p className="font-sans text-sm text-ked-text-muted mb-6">
                Are you a KED entrepreneur with an inspiring journey? We'd love to feature you in our Spotlight series.
              </p>
              <button
                className="bg-ked-primary text-white rounded-full px-8 py-3 font-sans font-medium hover:bg-ked-primary-hover transition-all"
                data-testid="submit-story-btn"
              >
                Submit Your Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
