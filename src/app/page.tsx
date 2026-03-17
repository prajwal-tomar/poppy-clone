import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { LogoStrip } from "@/components/landing/logo-strip";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeatureShowcase } from "@/components/landing/feature-showcase";
import { StatsSection } from "@/components/landing/stats-section";
import { Testimonial } from "@/components/landing/testimonial";
import { Differentiators } from "@/components/landing/differentiators";
import { Pricing } from "@/components/landing/pricing";
import { SocialProof } from "@/components/landing/social-proof";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ScrollReveal>
          <LogoStrip />
        </ScrollReveal>
        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal>
          <FeatureShowcase />
        </ScrollReveal>
        <ScrollReveal>
          <StatsSection />
        </ScrollReveal>
        <ScrollReveal>
          <Testimonial />
        </ScrollReveal>
        <ScrollReveal>
          <Differentiators />
        </ScrollReveal>
        <ScrollReveal>
          <SocialProof />
        </ScrollReveal>
        <ScrollReveal>
          <Pricing />
        </ScrollReveal>
        <ScrollReveal>
          <FinalCTA />
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
