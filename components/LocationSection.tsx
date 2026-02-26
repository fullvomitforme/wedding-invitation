"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { events } from "@/lib/data";
import { useInvitation } from "@/components/InvitationContext";
import { format } from "date-fns";
import { MapPin, ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function LocationSection() {
  const inv = useInvitation();
  const eventsToUse = inv?.content?.events?.length
    ? inv.content.events.map((ev) => ({ ...ev, date: new Date(ev.date) }))
    : events;
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".event-card").forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          delay: index * 0.2,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="location"
      ref={sectionRef}
      className="py-20 px-4 bg-white"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-16 text-gray-800">
          Event Locations
        </h2>

        <div className="space-y-8">
          {eventsToUse.map((event, index) => (
            <div
              key={index}
              className="event-card bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-gray-800 capitalize">
                {event.title}
              </h3>

              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-700 mb-1">
                  {format(event.date, "EEEE, MMMM do, yyyy")}
                </p>
                <p className="text-gray-600">{event.time}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-start gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-rose-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">{event.location}</p>
                    <p className="text-sm text-gray-600">{event.address}</p>
                  </div>
                </div>
              </div>

              {event.mapsUrl && (
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium transition-colors"
                >
                  See location
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {/* Google Maps Embed */}
              <div className="mt-6 rounded-lg overflow-hidden">
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Google Maps will be embedded here</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
