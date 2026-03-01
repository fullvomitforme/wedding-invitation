"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mainEventDate } from "@/lib/data";
import { useInvitation } from "@/components/InvitationContext";
import { getTemplateTheme } from "@/lib/template-themes";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function DateSection() {
  const inv = useInvitation();
  const mainDate = inv?.content?.mainEventDate
    ? new Date(inv.content.mainEventDate)
    : mainEventDate;
  const theme = getTemplateTheme(inv?.templateId);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".countdown-item", {
        scale: 0,
        rotation: -180,
        duration: 1,
        ease: "back.out(1.7)",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = mainDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [mainDate]);

  const saveToCalendar = () => {
    const startDate = format(mainDate, "yyyyMMdd'T'HHmmss");
    const endDate = format(
      new Date(mainDate.getTime() + 4 * 60 * 60 * 1000),
      "yyyyMMdd'T'HHmmss"
    );
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Ceremony&dates=${startDate}/${endDate}&details=Join+us+for+our+special+day`;
    window.open(calendarUrl, "_blank");
  };

  return (
    <section
      id="date"
      ref={sectionRef}
      className={`py-20 px-4 bg-gradient-to-b ${theme.gradientFrom} ${theme.gradientTo}`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-4xl md:text-5xl font-serif font-bold mb-12 ${theme.headingText}`}>
          Save the Date
        </h2>

        <div className="grid grid-cols-4 gap-4 md:gap-8 mb-12">
          {[
            { label: "days", value: countdown.days },
            { label: "hours", value: countdown.hours },
            { label: "minutes", value: countdown.minutes },
            { label: "seconds", value: countdown.seconds },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`countdown-item ${theme.cardBg} rounded-xl shadow-lg p-6`}
            >
              <div className={`text-4xl md:text-5xl font-bold ${theme.primaryText} mb-2`}>
                {item.value}
              </div>
              <div className={`text-sm md:text-base ${theme.bodyText} uppercase tracking-wide`}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <p className={`text-2xl md:text-3xl font-serif font-semibold ${theme.headingText} mb-2`}>
            {format(mainDate, "EEEE, MMMM do, yyyy")}
          </p>
        </div>

        <button
          onClick={saveToCalendar}
          className={`inline-flex items-center gap-2 px-6 py-3 ${theme.primaryBg} text-white rounded-full font-medium ${theme.primaryHover} transition-colors duration-300 hover:scale-105`}
        >
          <Calendar className="w-5 h-5" />
          Save event to calendar
        </button>
      </div>
    </section>
  );
}
