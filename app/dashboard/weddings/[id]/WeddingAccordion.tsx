"use client";

import { useState } from "react";
import { AccordionItem } from "@/components/ui/accordion";
import { ContentForm } from "./content/ContentForm";
import { SectionsForm } from "./layout-sections/SectionsForm";
import { SettingsForm } from "./settings/SettingsForm";
import type { WeddingContent } from "@/lib/wedding-defaults";
import type { SectionConfig } from "@/lib/wedding-defaults";

type WeddingAccordionProps = {
  weddingId: string;
  initialContent: WeddingContent;
  initialSections: SectionConfig[];
  initialSlug: string | null;
  initialStatus: string;
  initialTemplateId: string;
};

export function WeddingAccordion({
  weddingId,
  initialContent,
  initialSections,
  initialSlug,
  initialStatus,
  initialTemplateId,
}: WeddingAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>("couple");
  const [saveStates, setSaveStates] = useState<Record<string, "saved" | "unsaved" | null>>({
    couple: null,
    events: null,
    gallery: null,
    music: null,
    layout: null,
    settings: null,
  });

  const handleSectionChange = (sectionId: string, open: boolean) => {
    if (open) {
      setOpenSection(sectionId);
    } else {
      setOpenSection(null);
    }
  };

  const handleContentUnsaved = (section: string) => {
    setSaveStates((prev) => ({ ...prev, [section]: "unsaved" }));
  };

  const handleContentSaved = (section: string) => {
    setSaveStates((prev) => ({ ...prev, [section]: "saved" }));
    setTimeout(() => {
      setSaveStates((prev) => ({ ...prev, [section]: null }));
      // Optionally collapse after save
      // setOpenSection(null);
    }, 2000);
  };

  const handleSectionsUnsaved = () => {
    setSaveStates((prev) => ({ ...prev, layout: "unsaved" }));
  };

  const handleSectionsSaved = () => {
    setSaveStates((prev) => ({ ...prev, layout: "saved" }));
    setTimeout(() => {
      setSaveStates((prev) => ({ ...prev, layout: null }));
    }, 2000);
  };

  const handleSettingsUnsaved = () => {
    setSaveStates((prev) => ({ ...prev, settings: "unsaved" }));
  };

  const handleSettingsSaved = () => {
    setSaveStates((prev) => ({ ...prev, settings: "saved" }));
    setTimeout(() => {
      setSaveStates((prev) => ({ ...prev, settings: null }));
    }, 2000);
  };

  return (
    <div className="space-y-0">
      <AccordionItem
        id="couple"
        title="Couple"
        isOpen={openSection === "couple"}
        onOpenChange={(open) => handleSectionChange("couple", open)}
        saveStatus={saveStates.couple}
      >
        <ContentForm
          weddingId={weddingId}
          initialContent={initialContent}
          section="couple"
          onUnsaved={() => handleContentUnsaved("couple")}
          onSaved={() => handleContentSaved("couple")}
        />
      </AccordionItem>

      <AccordionItem
        id="events"
        title="Events"
        isOpen={openSection === "events"}
        onOpenChange={(open) => handleSectionChange("events", open)}
        saveStatus={saveStates.events}
      >
        <ContentForm
          weddingId={weddingId}
          initialContent={initialContent}
          section="events"
          onUnsaved={() => handleContentUnsaved("events")}
          onSaved={() => handleContentSaved("events")}
        />
      </AccordionItem>

      <AccordionItem
        id="gallery"
        title="Gallery"
        isOpen={openSection === "gallery"}
        onOpenChange={(open) => handleSectionChange("gallery", open)}
        saveStatus={saveStates.gallery}
      >
        <ContentForm
          weddingId={weddingId}
          initialContent={initialContent}
          section="gallery"
          onUnsaved={() => handleContentUnsaved("gallery")}
          onSaved={() => handleContentSaved("gallery")}
        />
      </AccordionItem>

      <AccordionItem
        id="music"
        title="Music"
        isOpen={openSection === "music"}
        onOpenChange={(open) => handleSectionChange("music", open)}
        saveStatus={saveStates.music}
      >
        <ContentForm
          weddingId={weddingId}
          initialContent={initialContent}
          section="music"
          onUnsaved={() => handleContentUnsaved("music")}
          onSaved={() => handleContentSaved("music")}
        />
      </AccordionItem>

      <AccordionItem
        id="layout"
        title="Layout"
        isOpen={openSection === "layout"}
        onOpenChange={(open) => handleSectionChange("layout", open)}
        saveStatus={saveStates.layout}
      >
        <SectionsForm
          weddingId={weddingId}
          initialSections={initialSections}
          onUnsaved={handleSectionsUnsaved}
          onSaved={handleSectionsSaved}
        />
      </AccordionItem>

      <AccordionItem
        id="settings"
        title="Settings"
        isOpen={openSection === "settings"}
        onOpenChange={(open) => handleSectionChange("settings", open)}
        saveStatus={saveStates.settings}
      >
        <SettingsForm
          weddingId={weddingId}
          initialSlug={initialSlug}
          initialStatus={initialStatus}
          initialSettings={initialContent.settings}
          initialContent={initialContent}
          onUnsaved={handleSettingsUnsaved}
          onSaved={handleSettingsSaved}
        />
      </AccordionItem>
    </div>
  );
}
