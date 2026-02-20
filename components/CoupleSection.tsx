"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { coupleData } from "@/lib/data";
import { MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CoupleSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const brideRef = useRef<HTMLDivElement>(null);
  const groomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(brideRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: brideRef.current,
          start: "top 80%",
        },
      });

      gsap.from(groomRef.current, {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: groomRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="couple"
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-b from-white to-rose-50/30"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-16 text-gray-800">
          The Couple
        </h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div
            ref={brideRef}
            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-200 to-pink-300 flex items-center justify-center overflow-hidden">
              {coupleData.bride.image ? (
                <img
                  src={coupleData.bride.image}
                  alt={coupleData.bride.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">👰</div>
              )}
            </div>
            <h3 className="text-3xl font-serif font-bold mb-2 text-gray-800">
              {coupleData.bride.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">@{coupleData.bride.username}</p>
            <div className="text-sm text-gray-600 mb-4 whitespace-pre-line">
              {coupleData.bride.parentInfo}
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{coupleData.bride.location}</span>
            </div>
          </div>

          <div
            ref={groomRef}
            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center overflow-hidden">
              {coupleData.groom.image ? (
                <img
                  src={coupleData.groom.image}
                  alt={coupleData.groom.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">🤵</div>
              )}
            </div>
            <h3 className="text-3xl font-serif font-bold mb-2 text-gray-800">
              {coupleData.groom.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">@{coupleData.groom.username}</p>
            <div className="text-sm text-gray-600 mb-4 whitespace-pre-line">
              {coupleData.groom.parentInfo}
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{coupleData.groom.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
