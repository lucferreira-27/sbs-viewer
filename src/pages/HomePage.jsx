import React, { useState, useEffect } from "react";
import { useSBS } from "../contexts/SBSContext";
import HeroSection from "../components/home/HeroSection";
import FeaturedCarousel from "../components/home/FeaturedCarousel";
import ExploreSection from "../components/home/ExploreSection";

function HomePage() {
  const { sbs_data, availableVolumes } = useSBS();
  const [featuredQAs, setFeaturedQAs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // QA Generation
  useEffect(() => {
    const getRandomItems = (array, count) => {
      return [...array].sort(() => 0.5 - Math.random()).slice(0, count);
    };

    const loadedVolumes = availableVolumes.filter(
      (volume) => sbs_data[volume] && sbs_data[volume].chapters
    );

    if (loadedVolumes.length === 0) {
      setFeaturedQAs([]);
      setIsLoading(false);
      return;
    }

    const generateQAs = () => {
      const randomVolumes = getRandomItems(loadedVolumes, 9);
      return randomVolumes
        .map((volume) => {
          if (!sbs_data[volume]?.chapters) return null;

          const volumeQAs = sbs_data[volume].chapters.flatMap((chapter) => {
            if (!chapter.sections) return [];

            return chapter.sections
              .filter((section) => section.type === "q&a")
              .map((section) => ({
                ...section,
                chapter: chapter.chapter,
                page: chapter.page,
                volume: volume,
              }));
          });

          const filteredQAs = volumeQAs.filter((qa) => {
            const questionLength = qa.question?.text?.length || 0;
            const answerLength = qa.answer?.segments?.[0]?.text?.length || 0;
            return (
              questionLength >= 20 &&
              questionLength <= 150 &&
              answerLength >= 30 &&
              answerLength <= 200
            );
          });

          return getRandomItems(filteredQAs, 1)[0];
        })
        .filter(Boolean);
    };

    setFeaturedQAs(generateQAs());
    setIsLoading(false);
  }, [sbs_data, availableVolumes]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      {!isLoading && <FeaturedCarousel featuredQAs={featuredQAs} />}
      <ExploreSection />
    </div>
  );
}

export default HomePage;
