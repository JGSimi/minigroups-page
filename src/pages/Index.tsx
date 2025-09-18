import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TopHitsSection from "@/components/TopHitsSection";
import AboutSection from "@/components/AboutSection";
import GameAcquisitionSection from "@/components/GameAcquisitionSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Reveal from "@/components/motion/Reveal";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Reveal y={40}>
          <HeroSection />
        </Reveal>
        <Reveal y={32} delay={0.05}>
          <TopHitsSection />
        </Reveal>
        <Reveal y={32} delay={0.1}>
          <AboutSection />
        </Reveal>
        <Reveal y={32} delay={0.1}>
          <GameAcquisitionSection />
        </Reveal>
        <Reveal y={32} delay={0.1}>
          <ContactSection />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
};

export default Index;