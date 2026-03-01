import { Check } from "lucide-react";

const benefits = [
  "Create beautiful invitations in minutes",
  "Share instantly with guests",
  "Track RSVPs in real-time",
  "Professional design templates",
];

export function BenefitList() {
  return (
    <ul className="landing-reveal space-y-3 mt-8">
      {benefits.map((benefit, index) => (
        <li
          key={benefit}
          className="flex items-start gap-3 text-xs md:text-sm text-muted-foreground group py-2 transition-[transform,background-color] duration-250 ease-out hover:bg-muted/20 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg px-2"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Check className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
          <span className="leading-snug">{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
