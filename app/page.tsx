import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Navbar from "@/components/landing/Navbar";
import Features from "@/components/landing/Features";
import LogoGrid from "@/components/landing/LogoGrid";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <LogoGrid />
      <Features />
      <HowItWorks />
      <CTASection />
      <Footer />
    </main>
  );
}
