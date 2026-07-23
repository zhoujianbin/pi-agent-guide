import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { WhyPi } from "@/sections/WhyPi";
import { LearningPath } from "@/sections/LearningPath";
import { ChapterGrid } from "@/sections/ChapterGrid";
import { AboutPi } from "@/sections/AboutPi";
import { FollowMe } from "@/sections/FollowMe";
import { useReveal } from "@/hooks/useReveal";
import { useEffect } from "react";
import { applyPageMeta, HOME_TITLE, HOME_DESCRIPTION } from "@/lib/seo";

export default function Home() {
  const ref = useReveal<HTMLDivElement>();

  useEffect(() => {
    applyPageMeta({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" });
  }, []);

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <WhyPi />
        <LearningPath />
        <ChapterGrid />
        <AboutPi />
        <FollowMe />
      </main>
      <Footer />
    </div>
  );
}
