import Hero from "@/components/common/Hero";
import Shop from "@/components/common/Shop";
import BeautyTreatmentSection from "@/components/common/beauty_treatment/BeautyTreatmentSection";
import HairStylingSection from "@/components/common/hair-styling/HairStylingSection";
import SkinCareSection from "@/components/common/skin-care/SkinCareSection";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <HairStylingSection />
      <SkinCareSection />
      <BeautyTreatmentSection />
      <Shop />
    </div>
  );
}
