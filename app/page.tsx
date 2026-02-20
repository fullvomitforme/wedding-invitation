"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import CoupleSection from "@/components/CoupleSection";
import GallerySection from "@/components/GallerySection";
import DateSection from "@/components/DateSection";
import LocationSection from "@/components/LocationSection";
import RSVPSection from "@/components/RSVPSection";
import LiveStreamingSection from "@/components/LiveStreamingSection";
import GiftSection from "@/components/GiftSection";
import WishesSection from "@/components/WishesSection";
import MusicPlayer from "@/components/MusicPlayer";
import { defaultSongs } from "@/lib/music";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize GSAP animations
    const ctx = gsap.context(() => {
      // Fade in sections on scroll
      gsap.utils.toArray<HTMLElement>("section").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <CoupleSection />
      <GallerySection />
      <DateSection />
      <LocationSection />
      <RSVPSection />
      <LiveStreamingSection />
      <GiftSection />
      <WishesSection />
      <MusicPlayer songs={defaultSongs} autoPlay={false} />
    </div>
  );
}
