"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { galleryImages, galleryQuote } from "@/lib/data";
import { X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
          delay: index * 0.1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-20 px-4 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gray-800">
            {galleryQuote.title}
          </h2>
          <p className="text-lg text-gray-600 italic max-w-2xl mx-auto">
            {galleryQuote.text}
          </p>
        </div>

        {galleryImages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 mb-2">You haven&apos;t uploaded any gallery yet.</p>
            <p className="text-sm text-gray-400">
              Please upload your best moments in the <strong>Gallery Section</strong>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className="gallery-item aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                onClick={() => setSelectedImage(image.url)}
              >
                <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-300 flex items-center justify-center">
                  <span className="text-4xl">📸</span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-rose-400 transition-colors"
            >
              <X size={32} />
            </button>
            <div className="max-w-4xl w-full">
              <div className="w-full aspect-square bg-gradient-to-br from-rose-200 to-pink-300 rounded-lg flex items-center justify-center">
                <span className="text-8xl">📸</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
