import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { getHeroSlides } from "@/services/api";

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // ── Fetch data ──
  useEffect(() => {
    getHeroSlides()
      .then((res) => setSlides(res.data))
      .catch((err) => console.error("Hero fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // ── Auto-slide mỗi 5 giây ──
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  // ── Loading state ──
  if (loading)
    return (
      <div className="w-full h-[560px] bg-[var(--color-zen-primary)] animate-pulse"></div>
    );

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section className="relative w-full h-[560px] overflow-hidden">
      {/* ── Slides ── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700
            ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"} `}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover"
          />
          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}
      {/* ── Text overlay ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-[var(--font-logo)] text-4xl md:text-6xl font-semibold text-white tracking-wide mb-4 drop-shadow-lg">
          {slide.title}
        </h1>
        <p className="font-[var(--font-sans)] text-lg md:text-xl text-white/80 mb-8 max-w-xl drop-shadow">
          {slide.subtitle}
        </p>
        <Button
          asChild
          className="rounded-none px-8 h-12 bg-[var(--color-zen-accent)] text-[var(--color-zen-primary)] hover:bg-[var(--color-zen-accent-hover)] font-[var(--font-logo)] text-base tracking-widest uppercase border-none shadow-lg transition-none shadow-lg transition-all duration-200"
        >
          <Link to={slide.cta_link}>{slide.cta}</Link>
        </Button>
      </div>
      {/* ── Arrow Left ── */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-[var(--color-zen-primary)] text-white hover:text-[var(--color-zen-primary)] transition-all duration-200 border border-white/20"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── Slide counter ── */}
      <div className="absolute bottom-4 right-6 z-30 font-[var(--font-logo)] text-sm text-white/70">
        {current + 1} / {slides.length}
      </div>
    </section>
  );
}
