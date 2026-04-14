import { motion } from "framer-motion";

export default function SectionHeading({ label, title, subtitle, align = "left" }) {
  const alignClasses = align === "center" ? "text-center" : "text-left";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-10 ${alignClasses}`}
    >
      {label && (
        <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-ked-primary mb-2 block">
          {label}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl text-ked-text leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="font-sans text-base text-ked-text-muted mt-3 max-w-2xl" style={align === "center" ? { margin: "0.75rem auto 0" } : {}}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
