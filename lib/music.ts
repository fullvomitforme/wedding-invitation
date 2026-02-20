export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
}

export const defaultSongs: Song[] = [
  {
    id: "1",
    title: "A Thousand Years",
    artist: "Christina Perri",
    url: "/music/a-thousand-years.mp3",
    cover: "/music/covers/a-thousand-years.jpg",
  },
  {
    id: "2",
    title: "Perfect",
    artist: "Ed Sheeran",
    url: "/music/perfect.mp3",
    cover: "/music/covers/perfect.jpg",
  },
  {
    id: "3",
    title: "All of Me",
    artist: "John Legend",
    url: "/music/all-of-me.mp3",
    cover: "/music/covers/all-of-me.jpg",
  },
  {
    id: "4",
    title: "At Last",
    artist: "Etta James",
    url: "/music/at-last.mp3",
    cover: "/music/covers/at-last.jpg",
  },
  {
    id: "5",
    title: "Canon in D",
    artist: "Pachelbel",
    url: "/music/canon-in-d.mp3",
    cover: "/music/covers/canon-in-d.jpg",
  },
];
