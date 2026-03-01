/**
 * Default sections and content shape for new weddings.
 * Matches types/index.ts and lib/data.ts so existing components can consume it.
 */

export interface SectionConfig {
  id: string;
  enabled: boolean;
  order: number;
}

export const defaultSections: SectionConfig[] = [
  { id: "hero", enabled: true, order: 0 },
  { id: "couple", enabled: true, order: 1 },
  { id: "date", enabled: true, order: 2 },
  { id: "location", enabled: true, order: 3 },
  { id: "gallery", enabled: true, order: 4 },
  { id: "rsvp", enabled: true, order: 5 },
  { id: "wishes", enabled: true, order: 6 },
  { id: "gift", enabled: true, order: 7 },
  { id: "music", enabled: true, order: 8 },
];

export interface WeddingContentCouple {
  name: string;
  username: string;
  parentInfo: string;
  location: string;
  image?: string;
}

export interface WeddingContentEvent {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapsUrl?: string;
}

export interface WeddingContentGalleryImage {
  id: string;
  url: string;
  alt: string;
}

export interface WeddingContentSong {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
}

export interface WeddingSettingsSeo {
  pageTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface WeddingSettingsPrivacy {
  accessType: "public" | "password" | "invite-only";
  password?: string;
  expiryDate?: string;
}

export interface WeddingSettings {
  seo?: WeddingSettingsSeo;
  privacy?: WeddingSettingsPrivacy;
}

export interface WeddingContent {
  couple?: {
    bride: WeddingContentCouple;
    groom: WeddingContentCouple;
  };
  events?: WeddingContentEvent[];
  gallery?: WeddingContentGalleryImage[];
  music?: WeddingContentSong[];
  mainEventDate?: string;
  blessingMessage?: { arabic: string; translation: string; source: string };
  galleryQuote?: { title: string; text: string };
  settings?: WeddingSettings;
}

export const defaultContent: WeddingContent = {
  couple: {
    bride: {
      name: "",
      username: "",
      parentInfo: "",
      location: "",
      image: "",
    },
    groom: {
      name: "",
      username: "",
      parentInfo: "",
      location: "",
      image: "",
    },
  },
  events: [],
  gallery: [],
  music: [],
  settings: {
    privacy: {
      accessType: "public",
    },
  },
};
