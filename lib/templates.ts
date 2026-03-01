import { ClassicTemplate } from "@/app/invitation/ClassicTemplate";
import type { WeddingContent } from "./wedding-defaults";
import type { SectionConfig } from "./wedding-defaults";

export interface TemplateProps {
  weddingId: string;
  content: WeddingContent;
  sections: SectionConfig[];
}

export interface WeddingTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "traditional" | "modern" | "minimalist" | "decorative";
  component: React.ComponentType<TemplateProps>;
}

export const TEMPLATES: WeddingTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Elegant serif typography with rose accents and traditional layout",
    thumbnail: "/templates/classic-thumb.jpg",
    category: "traditional",
    component: ClassicTemplate,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold dark mode with gradient accents and asymmetric grid",
    thumbnail: "/templates/modern-thumb.jpg",
    category: "modern",
    component: null as any, // Will be set after ModernTemplate is created
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean black and white with lots of whitespace",
    thumbnail: "/templates/minimalist-thumb.jpg",
    category: "minimalist",
    component: null as any, // Will be set after MinimalistTemplate is created
  },
  {
    id: "floral",
    name: "Floral",
    description: "Organic shapes with soft pastel colors and decorative elements",
    thumbnail: "/templates/floral-thumb.jpg",
    category: "decorative",
    component: null as any, // Will be set after FloralTemplate is created
  },
];

export function getTemplate(id: string): WeddingTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplateComponent(id: string): React.ComponentType<TemplateProps> {
  const template = getTemplate(id);
  return template?.component || ClassicTemplate;
}
