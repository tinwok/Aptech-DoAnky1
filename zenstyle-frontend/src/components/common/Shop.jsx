import { useState, useEffect, useRef } from "react";
import { ServiceCard } from "@/ui";
import { getHairProduct, getSkinProduct } from "@/services/api";

const TABS = [
  { key: "hair", label: "Chăm sóc tóc", link: "/san-pham/hair-styling" },
  { key: "skin", label: "Chăm sóc da", link: "/san-pham/skin-care" },
];

export default function Shop() {
  const [activeTab, setActiveTab] = useState("hair");
  const [hairProducts, setHairProducts] = useState([]);
  const [skinProducts, setSkinProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  // ── Fetch data ──
  useEffect(() => {
    Promise.all([getHairProduct(), getSkinProduct()])
      .then(([hair, skin]) => {
        setHairProducts(hair.data);
        setSkinProducts(skin.data);
      })
      .catch((err) => console.error("Shop fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // reset scroll khi đổi tab
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  const activeTabData = TABS.find((t) => t.key === activeTab);
  const items = activeTab === "hair" ? hairProducts : skinProducts;

  const slideLeft = () => {
    sliderRef.current?.scrollBy({ left: -220, behavior: "smooth" });
  };

  const slideRight = () => {
    sliderRef.current?.scrollBy({ left: 220, behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-[var(--color-zen-accent)]/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Section header ── */}
        <div className="text-center mb-8">
          <h2
            className="
            font-[var(--font-logo)] text-4xl font-semibold
            text-[var(--color-zen-primary)] tracking-wide mb-3
          "
          >
            Sản phẩm
          </h2>
          <div className="w-16 h-0.5 bg-[var(--color-zen-accent)] mx-auto" />
        </div>

        {/* ── Tabs + product count ── */}
        <div className="flex items-center justify-between mb-6">
          {/* Tabs */}
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  px-8 h-10
                  font-[var(--font-logo)] text-sm tracking-wide
                  border border-[var(--color-zen-accent)]
                  transition-all duration-200
                  ${
                    activeTab === tab.key
                      ? "bg-[var(--color-zen-accent)] text-[var(--color-zen-primary)]"
                      : "bg-transparent text-[var(--color-zen-primary)] hover:bg-[var(--color-zen-accent)]/30"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product count */}
          {!loading && (
            <span
              className="
              font-[var(--font-sans)] text-sm
              text-[var(--color-zen-primary)]/60
            "
            >
              {items.length} sản phẩm
            </span>
          )}
        </div>

        {/* ── Slider ── */}
        <div className="relative">
          {/* Arrow Left */}
          <button
            onClick={slideLeft}
            className="
              absolute -left-5 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 flex items-center justify-center
              bg-[var(--color-zen-accent)]
              text-[var(--color-zen-primary)]
              hover:bg-[var(--color-zen-accent-hover)]
              transition-all duration-200
              shadow-md
            "
            aria-label="Trượt trái"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Cards */}
          {loading ? (
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-44 h-64 bg-[var(--color-zen-accent)]/20 animate-pulse shrink-0"
                />
              ))}
            </div>
          ) : (
            <div
              ref={sliderRef}
              className="
                flex gap-2
                overflow-x-auto scroll-smooth
                scrollbar-hide
                px-1 py-2
              "
            >
              {items.map((item) => (
                <ServiceCard
                  key={item.id}
                  item={item}
                  size="small"
                  moreInfoLink={activeTabData.link}
                />
              ))}
            </div>
          )}

          {/* Arrow Right */}
          <button
            onClick={slideRight}
            className="
              absolute -right-5 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 flex items-center justify-center
              bg-[var(--color-zen-accent)]
              text-[var(--color-zen-primary)]
              hover:bg-[var(--color-zen-accent-hover)]
              transition-all duration-200
              shadow-md
            "
            aria-label="Trượt phải"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
