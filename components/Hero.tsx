"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { coupleData, blessingMessage } from "@/lib/data";
import { Heart } from "lucide-react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.to(overlayRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
        }}
      >
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
      >
        <div className="mb-6">
          <Heart className="w-12 h-12 mx-auto mb-4 fill-rose-400 text-rose-400 animate-pulse" />
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
          {coupleData.bride.name}
        </h1>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-20 bg-white/50" />
          <Heart className="w-6 h-6 fill-rose-400 text-rose-400" />
          <div className="h-px w-20 bg-white/50" />
        </div>

        <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8">
          {coupleData.groom.name}
        </h2>

        <p className="text-lg md:text-xl mb-4 opacity-90">
          {blessingMessage.translation}
        </p>
        <p className="text-sm md:text-base opacity-75 italic">
          {blessingMessage.source}
        </p>

        <div className="mt-12">
          <button
            onClick={() => {
              document.getElementById("couple")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105"
          >
            Discover Our Story
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
