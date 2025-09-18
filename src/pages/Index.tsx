import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TopHitsSection from "@/components/TopHitsSection";
import AboutSection from "@/components/AboutSection";
import GameAcquisitionSection from "@/components/GameAcquisitionSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <TopHitsSection />
        <AboutSection />
        <GameAcquisitionSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;