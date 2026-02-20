export interface Couple {
  name: string;
  username: string;
  parentInfo: string;
  location: string;
  image?: string;
}

export interface Event {
  title: string;
  date: Date;
  time: string;
  location: string;
  address: string;
  mapsUrl?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export interface Wish {
  id: string;
  name: string;
  location: string;
  message: string;
  createdAt: Date;
}

export interface RSVPResponse {
  name: string;
  attendance: "yes" | "no" | "maybe";
  guestCount: number;
  message?: string;
}
