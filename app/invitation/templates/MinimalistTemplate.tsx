"use client";

import { InvitationProvider } from "@/components/InvitationContext";
import Hero from "@/components/Hero";
import CoupleSection from "@/components/CoupleSection";
import DateSection from "@/components/DateSection";
import LocationSection from "@/components/LocationSection";
import GallerySection from "@/components/GallerySection";
import RSVPSection from "@/components/RSVPSection";
import WishesSection from "@/components/WishesSection";
import GiftSection from "@/components/GiftSection";
import MusicPlayer from "@/components/MusicPlayer";
import type { WeddingContent } from "@/lib/wedding-defaults";
import type { SectionConfig } from "@/lib/wedding-defaults";

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Hero,
  couple: CoupleSection,
  date: DateSection,
  location: LocationSection,
  gallery: GallerySection,
  rsvp: RSVPSection,
  wishes: WishesSection,
  gift: GiftSection,
  music: MusicPlayer,
};

interface MinimalistTemplateProps {
  weddingId: string;
  content: WeddingContent;
  sections: SectionConfig[];
}

export function MinimalistTemplate({ weddingId, content, sections }: MinimalistTemplateProps) {
  const sorted = [...sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <InvitationProvider value={{ weddingId, content, sections }}>
      <div className="min-h-screen bg-white text-neutral-900">
        {sorted.map((section) => {
          const Component = SECTION_COMPONENTS[section.id];
          if (!Component) return null;
          return <Component key={section.id} />;
        })}
      </div>
    </InvitationProvider>
  );
}
