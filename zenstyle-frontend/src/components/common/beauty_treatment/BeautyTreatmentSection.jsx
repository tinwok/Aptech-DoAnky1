import BeautyTreatment from "./BeautyTreatment";

const TABS = [{ label: "Chăm sóc sắc đẹp", component: <BeautyTreatment /> }];

export default function BeautyTreatmentSection() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-12">
        <h2
          className="
          font-[var(--font-logo)] text-4xl font-semibold
          text-[var(--color-zen-primary)] tracking-wide mb-3
        "
        >
          Beauty Treatment
        </h2>
        <div className="w-16 h-0.5 bg-[var(--color-zen-accent)] mx-auto" />
      </div>

      {/* Sub-sections */}
      <div className="flex flex-col gap-16">
        {TABS.map((tab) => (
          <div key={tab.label}>
            <h3
              className="
              font-[var(--font-logo)] text-2xl
              text-[var(--color-zen-primary)] tracking-wide
              mb-6 pb-2
              border-b-2 border-[var(--color-zen-accent)]
              inline-block
            "
            >
              {tab.label}
            </h3>
            {tab.component}
          </div>
        ))}
      </div>
    </section>
  );
}
