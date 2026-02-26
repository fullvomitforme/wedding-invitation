"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wish } from "@/types";
import { format } from "date-fns";
import { useInvitation } from "@/components/InvitationContext";
import { Send, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function WishesSection() {
  const inv = useInvitation();
  const weddingId = inv?.weddingId;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishes = async () => {
      setLoading(true);
      try {
        const url = weddingId ? `/api/wishes?wedding_id=${encodeURIComponent(weddingId)}` : "/api/wishes";
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const wishesData = (data.data as { id: string; name: string; location: string; message: string; createdAt: string }[]).map((wish) => ({
            ...wish,
            createdAt: new Date(wish.createdAt),
          }));
          setWishes(wishesData);
        }
      } catch (err) {
        console.error("Error fetching wishes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishes();
  }, [weddingId]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".wish-item").forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          x: -30,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
          delay: index * 0.1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [wishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const body = weddingId ? { ...formData, wedding_id: weddingId } : formData;
      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit wish");
      }

      const data = await response.json();
      const newWish: Wish = {
        ...data.data,
        createdAt: new Date(data.data.createdAt),
      };
      setWishes([newWish, ...wishes]);
      setFormData({ name: "", location: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="wishes"
      ref={sectionRef}
      className="py-20 px-4 bg-white"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-16 text-gray-800">
          Wishes
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading wishes...</p>
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {wishes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No wishes yet. Be the first to send one!</p>
              </div>
            ) : (
              wishes.map((wish) => (
            <div
              key={wish.id}
              className="wish-item bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-200 to-pink-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-gray-700">
                    {wish.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-800">{wish.name}</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{wish.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{wish.message}</p>
                  <p className="text-xs text-gray-400">
                    {format(wish.createdAt, "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>
              ))
            )}
          </div>
        )}

        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Send a wish:</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Your location"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              placeholder="Your wish..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all resize-none"
            />
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-4 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition-colors duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {submitting ? "Submitting..." : "Submit now"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
