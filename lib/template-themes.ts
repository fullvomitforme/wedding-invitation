export interface TemplateTheme {
  sectionBg: string;
  cardBg: string;
  headingText: string;
  bodyText: string;
  mutedText: string;
  primaryBg: string;
  primaryText: string;
  primaryHover: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  accentBg: string;
  accentText: string;
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
}

export const templateThemes: Record<string, TemplateTheme> = {
  classic: {
    sectionBg: "bg-white",
    cardBg: "bg-white",
    headingText: "text-gray-800",
    bodyText: "text-gray-600",
    mutedText: "text-gray-500",
    primaryBg: "bg-rose-500",
    primaryText: "text-rose-500",
    primaryHover: "hover:bg-rose-600",
    borderColor: "border-gray-200",
    gradientFrom: "from-white",
    gradientTo: "to-rose-50/30",
    accentBg: "bg-rose-100",
    accentText: "text-rose-600",
    inputBg: "bg-white",
    inputBorder: "border-gray-300",
    inputFocus: "focus:ring-rose-500 focus:border-rose-500",
  },
  modern: {
    sectionBg: "bg-slate-950",
    cardBg: "bg-slate-900",
    headingText: "text-white",
    bodyText: "text-slate-300",
    mutedText: "text-slate-400",
    primaryBg: "bg-indigo-500",
    primaryText: "text-indigo-400",
    primaryHover: "hover:bg-indigo-600",
    borderColor: "border-slate-700",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-purple-600",
    accentBg: "bg-indigo-500/20",
    accentText: "text-indigo-400",
    inputBg: "bg-slate-800",
    inputBorder: "border-slate-700",
    inputFocus: "focus:ring-indigo-500 focus:border-indigo-500",
  },
  minimalist: {
    sectionBg: "bg-white",
    cardBg: "bg-white",
    headingText: "text-black",
    bodyText: "text-neutral-700",
    mutedText: "text-neutral-500",
    primaryBg: "bg-black",
    primaryText: "text-black",
    primaryHover: "hover:bg-neutral-800",
    borderColor: "border-neutral-200",
    gradientFrom: "from-white",
    gradientTo: "to-white",
    accentBg: "bg-neutral-100",
    accentText: "text-black",
    inputBg: "bg-white",
    inputBorder: "border-neutral-300",
    inputFocus: "focus:ring-black focus:border-black",
  },
  floral: {
    sectionBg: "bg-stone-50",
    cardBg: "bg-white",
    headingText: "text-stone-800",
    bodyText: "text-stone-700",
    mutedText: "text-stone-500",
    primaryBg: "bg-stone-400",
    primaryText: "text-stone-600",
    primaryHover: "hover:bg-stone-500",
    borderColor: "border-stone-200",
    gradientFrom: "from-stone-50",
    gradientTo: "to-stone-100/50",
    accentBg: "bg-stone-100",
    accentText: "text-stone-700",
    inputBg: "bg-white",
    inputBorder: "border-stone-300",
    inputFocus: "focus:ring-stone-400 focus:border-stone-400",
  },
};

export function getTemplateTheme(templateId: string | null | undefined): TemplateTheme {
  const id = templateId ?? "classic";
  return templateThemes[id] ?? templateThemes.classic;
}
