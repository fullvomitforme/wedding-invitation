import type React from "react";
import { ClassicTemplate } from "@/app/invitation/ClassicTemplate";
import { ModernTemplate } from "@/app/invitation/templates/ModernTemplate";
import { MinimalistTemplate } from "@/app/invitation/templates/MinimalistTemplate";
import { FloralTemplate } from "@/app/invitation/templates/FloralType";
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
    thumbnail: "/templates/classic-thumb.svg",
    category: "traditional",
    component: ClassicTemplate,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold dark mode with gradient accents and asymmetric grid",
    thumbnail: "/templates/modern-thumb.svg",
    category: "modern",
    component: ModernTemplate,
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean black and white with lots of whitespace",
    thumbnail: "/templates/minimalist-thumb.svg",
    category: "minimalist",
    component: MinimalistTemplate,
  },
  {
    id: "floral",
    name: "Floral",
    description: "Organic shapes with soft pastel colors and decorative elements",
    thumbnail: "/templates/floral-thumb.svg",
    category: "decorative",
    component: FloralTemplate,
  },
];

export function getTemplate(id: string): WeddingTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplateComponent(id: string): React.ComponentType<TemplateProps> {
  const template = getTemplate(id);
  return template?.component || ClassicTemplate;
}
