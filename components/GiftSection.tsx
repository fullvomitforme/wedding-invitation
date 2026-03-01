"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInvitation } from "@/components/InvitationContext";
import { getTemplateTheme } from "@/lib/template-themes";
import { Gift } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function GiftSection() {
  const inv = useInvitation();
  const theme = getTemplateTheme(inv?.templateId);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gift-content", {
        opacity: 0,
        y: 30,
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
      className={`py-20 px-4 bg-gradient-to-b ${theme.gradientFrom} ${theme.gradientTo}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className={`gift-content ${theme.cardBg} rounded-2xl shadow-lg p-8 md:p-12 text-center`}>
          <div className="mb-6">
            <Gift className={`w-16 h-16 mx-auto mb-4 ${theme.primaryText}`} />
          </div>
          <h2 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${theme.headingText}`}>
            Send your gift
          </h2>
          <p className={`text-lg ${theme.bodyText} mb-8`}>
            Catatan kado atau kata kata terimakasih untuk yang memberikan hadiah. di menu (Amplop
            digital)
          </p>
          <button className={`px-8 py-4 ${theme.primaryBg} text-white rounded-full font-semibold ${theme.primaryHover} transition-colors duration-300 hover:scale-105`}>
            Make a gift now
          </button>
        </div>
      </div>
    </section>
  );
}
