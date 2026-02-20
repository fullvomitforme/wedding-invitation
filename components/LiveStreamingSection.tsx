"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Video } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function LiveStreamingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".streaming-content", {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-white"
    >
      <div className="max-w-4xl mx-auto">
        <div className="streaming-content bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center">
          <div className="mb-6">
            <Video className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Live Streaming
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Please join the live streaming. *live streaming words/notes can be edited in the live
            streaming menu
          </p>
          <button className="px-8 py-4 bg-white text-rose-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 hover:scale-105">
            Go to streaming
          </button>
        </div>
      </div>
    </section>
  );
}
