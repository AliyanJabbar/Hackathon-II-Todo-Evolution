import Hero from "@/components/home/hero";
import FeatureGrid from "@/components/home/feature-grid";
import DemoSection from "@/components/home/demo-section";
import CtaBanner from "@/components/home/cta-banner";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-10">
      {/* 1. Hero: Catch the judge's attention immediately */}
      <Hero />
      
      {/* 2. Demo: Show, don't just tell (Crucial for hackathons) */}
      <DemoSection />

      {/* 3. Features: Explain the 'How' and 'Why' */}
      <FeatureGrid />

      {/* 4. Final Call to Action */}
      <CtaBanner />
    </div>
  );
}