import { BadgeCheck, Shield, Heart, Award } from "lucide-react";

const badgeConfig = {
  "Verified Seller": { icon: BadgeCheck, color: "text-ked-success", bg: "bg-green-50" },
  "Women-Led": { icon: Heart, color: "text-ked-primary", bg: "bg-[#FDF2EC]" },
  "Trusted Provider": { icon: Shield, color: "text-blue-500", bg: "bg-blue-50" },
  "KED Featured": { icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
  "Top Rated": { icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
  "Bestseller": { icon: Award, color: "text-ked-primary", bg: "bg-[#FDF2EC]" },
  "Rising Star": { icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
  "Heritage Artisan": { icon: Shield, color: "text-ked-primary", bg: "bg-[#FDF2EC]" },
  "Artisan Craft": { icon: Shield, color: "text-ked-primary", bg: "bg-[#FDF2EC]" },
  "Community Leader": { icon: Heart, color: "text-ked-primary", bg: "bg-[#FDF2EC]" },
  "Eco-Friendly": { icon: Shield, color: "text-ked-success", bg: "bg-green-50" },
};

export function TrustBadge({ badge, size = "sm" }) {
  const config = badgeConfig[badge] || { icon: BadgeCheck, color: "text-ked-text-muted", bg: "bg-ked-surface" };
  const Icon = config.icon;
  const sizeClasses = size === "lg" ? "px-3 py-1.5 text-xs" : "px-2 py-0.5 text-[10px]";
  const iconSize = size === "lg" ? "w-4 h-4" : "w-3 h-3";

  return (
    <span
      className={`inline-flex items-center gap-1 ${config.bg} ${sizeClasses} rounded-full font-sans font-medium`}
      data-testid={`trust-badge-${badge.toLowerCase().replace(/\s/g, "-")}`}
    >
      <Icon className={`${iconSize} ${config.color}`} />
      <span className="text-ked-text-body">{badge}</span>
    </span>
  );
}

export function TrustStrip() {
  const trustItems = [
    { icon: BadgeCheck, text: "KED Verified Sellers" },
    { icon: Shield, text: "Safe & Trusted" },
    { icon: Heart, text: "100% Women-Led" },
    { icon: Award, text: "Curated Quality" },
  ];

  return (
    <div className="bg-[#FAF8F5] border-y border-ked-border" data-testid="trust-strip">
      <div className="ked-container py-4">
        <div className="flex items-center justify-center gap-8 md:gap-16 overflow-x-auto">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="flex items-center gap-2 whitespace-nowrap">
                <Icon className="w-4 h-4 text-ked-primary" />
                <span className="text-xs font-sans font-medium text-ked-text-muted uppercase tracking-wider">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
