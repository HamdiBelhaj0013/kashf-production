import { getProjects, getClients, getTeam, getSocialLinks } from "@/lib/api";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import WorkSection from "@/components/WorkSection";
import ClientsSection from "@/components/ClientsSection";
import WhyUsSection from "@/components/WhyUsSection";
import ProcessSection from "@/components/ProcessSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";

export default async function HomePage() {
  const [projects, clients, team, socialLinks] = await Promise.all([
    getProjects(),
    getClients(),
    getTeam(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center bg-white text-gray-900 w-full overflow-x-hidden selection:bg-gray-900 selection:text-white">
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <ServicesSection />
        <WorkSection projects={projects} />
        <ClientsSection clients={clients} />
        <WhyUsSection />
        <ProcessSection />
        <TeamSection team={team} />
        <ContactSection />
      </main>
      <FooterSection socialLinks={socialLinks} />
    </>
  );
}
