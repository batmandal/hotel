import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { SearchBar } from "@/components/layout/SearchBar";
import { AboutSummarySection } from "@/components/home/AboutSummarySection";
import { RoomTypesSection } from "@/components/home/RoomTypesSection";
import { FeaturedRoomsCarousel } from "@/components/home/FeaturedRoomsCarousel";
import { RoomIntroVideoSection } from "@/components/home/RoomIntroVideoSection";
import { ServicesCarousel } from "@/components/home/ServicesCarousel";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { ExploreRoomsSection } from "@/components/home/ExploreRoomsSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <SearchBar />
      <main>
        <AboutSummarySection />
        <RoomTypesSection />
        <FeaturedRoomsCarousel />
        <ServicesCarousel />
        <ExploreRoomsSection />
        <RoomIntroVideoSection />
        <TestimonialsCarousel />
      </main>
      <Footer />
    </div>
  );
}
