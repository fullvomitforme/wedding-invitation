"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RSVPResponse } from "@/types";
import { useInvitation } from "@/components/InvitationContext";
import { Send, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function RSVPSection() {
  const inv = useInvitation();
  const weddingId = inv?.weddingId;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [guestCount, setGuestCount] = useState(0);
  const [formData, setFormData] = useState<RSVPResponse>({
    name: "",
    attendance: "yes",
    guestCount: 1,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = weddingId ? `/api/rsvp?wedding_id=${encodeURIComponent(weddingId)}` : "/api/rsvp";
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setGuestCount(data.statistics?.totalGuests || 0);
        }
      } catch (err) {
        console.error("Error fetching RSVP stats:", err);
      }
    };
    fetchStats();
  }, [weddingId]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".rsvp-content", {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body = weddingId ? { ...formData, wedding_id: weddingId } : formData;
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit RSVP");
      }

      const statsUrl = weddingId ? `/api/rsvp?wedding_id=${encodeURIComponent(weddingId)}` : "/api/rsvp";
      const statsResponse = await fetch(statsUrl);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setGuestCount(statsData.statistics?.totalGuests || 0);
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          attendance: "yes",
          guestCount: 1,
          message: "",
        });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="rsvp"
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-b from-white to-rose-50/30"
    >
      <div className="max-w-4xl mx-auto">
        <div className="rsvp-content text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-rose-100 rounded-full">
            <Users className="w-5 h-5 text-rose-600" />
            <span className="text-rose-600 font-semibold">
              {guestCount} guest{guestCount !== 1 ? "s" : ""} response will join
            </span>
          </div>
          <p className="text-gray-600 mb-2">
            let&apos;s send your response too.
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gray-800">
            Reservation (RSVP)
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            It is an honor and happiness for us if, Mr / Mrs / Brother / i. Thank you for
            coming to give us your blessing.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Thank you for your response!
              </h3>
              <p className="text-gray-600">We&apos;re looking forward to celebrating with you.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Will you attend? *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(["yes", "no", "maybe"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, attendance: option })}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        formData.attendance === option
                          ? "bg-rose-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {formData.attendance === "yes" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.guestCount}
                    onChange={(e) =>
                      setFormData({ ...formData, guestCount: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Leave a message for the couple..."
                />
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition-colors duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Now"}
              </button>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-4">also invite:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Keluarga Besar Bapak Sujono</li>
              <li>• Keluarga Besar PT Emence</li>
              <li>• Teman Teman SMKN 1</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
