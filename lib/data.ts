import { Couple, Event, GalleryImage } from "@/types";

export const coupleData: { bride: Couple; groom: Couple } = {
  bride: {
    name: "Adinda Mawaria",
    username: "adinda",
    parentInfo: "Youngest Daughter of\nBapak Sanusi S.M &\nIbu Jubaedah",
    location: "dari london utara",
    image: "/bride.jpg",
  },
  groom: {
    name: "John Doe S.kom",
    username: "john_doe",
    parentInfo: "First Son of\nBapak Akbar S.kom &\nIbu Siti maimunah",
    location: "dari jakarta, Indonesia",
    image: "/groom.jpg",
  },
};

export const events: Event[] = [
  {
    title: "marriage contract",
    date: new Date("2023-04-28"),
    time: "09:00 WIB - finish",
    location: "Masjid Al - Barkah",
    address: "Jl. Veteran No.46, RT.003/RW.004, Marga Jaya, Kec. Bekasi Sel., Kota Bks, Jawa Barat 17141",
    mapsUrl: "https://maps.google.com/?q=Masjid+Al+Barkah+Bekasi",
  },
  {
    title: "reception",
    date: new Date("2024-03-15"),
    time: "15:00 WIB - finish",
    location: "DoubleTree by Hilton Jakarta - Diponegoro",
    address: "Plataran Menteng, Jalan HOS. Cokroaminoto, RT.6/RW.4, Gondangdia, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta, Indonesia",
    mapsUrl: "https://maps.google.com/?q=DoubleTree+by+Hilton+Jakarta+Diponegoro",
  },
];

export const mainEventDate = new Date("2026-02-28");

export const galleryImages: GalleryImage[] = [
  { id: "1", url: "/gallery/1.jpg", alt: "Precious moment 1" },
  { id: "2", url: "/gallery/2.jpg", alt: "Precious moment 2" },
  { id: "3", url: "/gallery/3.jpg", alt: "Precious moment 3" },
  { id: "4", url: "/gallery/4.jpg", alt: "Precious moment 4" },
  { id: "5", url: "/gallery/5.jpg", alt: "Precious moment 5" },
  { id: "6", url: "/gallery/6.jpg", alt: "Precious moment 6" },
];

export const blessingMessage = {
  arabic: "يَتَفَكَّرُونَ",
  translation: "And among the signs of His power is that He created for you wives of your own kind, so that you would be inclined and feel at ease with them, and He made among you a feeling of love and affection. Indeed, in that there are truly signs for a person who thinks.",
  source: "QS. Ar-Rum: 21",
};

export const galleryQuote = {
  title: "Precious moment",
  text: '"Creating memories is a priceless gift. Memories last a lifetime; objects last only a short time."',
};
