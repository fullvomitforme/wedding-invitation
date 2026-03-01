"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { coupleData } from "@/lib/data";
import { useInvitation } from "@/components/InvitationContext";
import { getTemplateTheme } from "@/lib/template-themes";
import { MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CoupleSection() {
  const inv = useInvitation();
  const coupleDataToUse = inv?.content?.couple ?? { bride: coupleData.bride, groom: coupleData.groom };
  const theme = getTemplateTheme(inv?.templateId);
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
      className={`py-20 px-4 bg-gradient-to-b ${theme.gradientFrom} ${theme.gradientTo}`}
    >
      <div className="mx-auto max-w-6xl">
        <h2 className={`text-4xl md:text-5xl font-serif font-bold text-center mb-16 ${theme.headingText}`}>
          The Couple
        </h2>

        <div className="gap-8 md:gap-12 grid md:grid-cols-2">
          <div
            ref={brideRef}
            className={`${theme.cardBg} rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300`}
          >
            <div className={`w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} flex items-center justify-center overflow-hidden`}>
              {coupleDataToUse.bride.image ? (
                <img
                  src={coupleDataToUse.bride.image}
                  alt={coupleDataToUse.bride.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">👰</div>
              )}
            </div>
            <h3 className={`text-3xl font-serif font-bold mb-2 ${theme.headingText}`}>
              {coupleDataToUse.bride.name}
            </h3>
            <p className={`text-sm ${theme.mutedText} mb-4`}>@{coupleDataToUse.bride.username}</p>
            <div className={`text-sm ${theme.bodyText} mb-4 whitespace-pre-line`}>
              {coupleDataToUse.bride.parentInfo}
            </div>
            <div className={`flex items-center justify-center gap-2 ${theme.mutedText}`}>
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{coupleDataToUse.bride.location}</span>
            </div>
          </div>

          <div
            ref={groomRef}
            className={`${theme.cardBg} rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300`}
          >
            <div className={`w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} flex items-center justify-center overflow-hidden`}>
              {coupleDataToUse.groom.image ? (
                <img
                  src={coupleDataToUse.groom.image}
                  alt={coupleDataToUse.groom.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">🤵</div>
              )}
            </div>
            <h3 className={`text-3xl font-serif font-bold mb-2 ${theme.headingText}`}>
              {coupleDataToUse.groom.name}
            </h3>
            <p className={`text-sm ${theme.mutedText} mb-4`}>@{coupleDataToUse.groom.username}</p>
            <div className={`text-sm ${theme.bodyText} mb-4 whitespace-pre-line`}>
              {coupleDataToUse.groom.parentInfo}
            </div>
            <div className={`flex items-center justify-center gap-2 ${theme.mutedText}`}>
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{coupleDataToUse.groom.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
