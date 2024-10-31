import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSBS } from "../contexts/SBSContext";
import FeaturedQACard from "./FeaturedQACard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faSearch,
  faFilter,
  faUser,
  faArrowRight,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";

function HomePage() {
  const { sbs_data, currentVolume, availableVolumes } = useSBS();

  const [isLoading, setIsLoading] = useState(true);

  const featuredQAs = React.useMemo(() => {
    const getRandomItems = (array, count) => {
      const shuffled = [...array].sort(() => 0.5 - Math.random());

      return shuffled.slice(0, count);
    };

    // First, filter out volumes that don't have data yet

    const loadedVolumes = availableVolumes.filter((volume) => {
      return sbs_data[volume] && sbs_data[volume].chapters;
    });

    if (loadedVolumes.length === 0) {
      return [];
    }

    // Get random volumes from the loaded ones

    const randomVolumes = getRandomItems(loadedVolumes, 3);
    const selectedQAs = randomVolumes

      .map((volume) => {
        // Make sure we have data for this volume

        if (!sbs_data[volume]?.chapters) {
          console.log(`No data for volume ${volume}`);

          return null;
        }

        const volumeQAs = sbs_data[volume].chapters.flatMap((chapter) => {
          // Make sure chapter has sections

          if (!chapter.sections) {
            console.log(
              `No sections in chapter ${chapter.chapter} of volume ${volume}`
            );

            return [];
          }

          return chapter.sections
            .filter((section) => section.type === "q&a")
            .map((section) => ({
              ...section,

              chapter: chapter.chapter,

              page: chapter.page,

              volume: volume,
            }));
        });

        console.log(`Found ${volumeQAs.length} QAs in volume ${volume}`);

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

        console.log(
          `After filtering: ${filteredQAs.length} QAs in volume ${volume}`
        );

        return getRandomItems(filteredQAs, 1)[0];
      })

      .filter(Boolean);

    setIsLoading(false);

    return selectedQAs;
  }, [sbs_data, availableVolumes]);

  // Show loading state while data is being fetched

  if (isLoading && availableVolumes.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-white rounded-2xl shadow-sm min-h-[420px]"
          >
            <div className="h-2 bg-gray-200 rounded-t-2xl" />

            <div className="p-6">
              <div className="h-10 bg-gray-100 rounded-full w-1/3 mb-4" />

              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />

                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper/30">
      {/* Hero Section */}
      <section className="py-20 mb-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent mb-6 text-sm">
            Explore One Piece SBS
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ink">
            Discover the World of
            <span className="block text-accent">One Piece SBS</span>
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Dive into Oda's fascinating answers, character insights, and behind-the-scenes 
            details from the SBS (Question Corner) sections.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/search"
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Start Exploring
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
            <Link
              to="/browse"
              className="px-6 py-3 bg-white text-accent rounded-lg hover:bg-accent/5 transition-colors"
            >
              Browse Volumes
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Questions */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-accent text-2xl">❝</span>
            <h2 className="text-xl font-bold text-ink">Featured Questions</h2>
          </div>
          <Link to="/browse" className="text-accent hover:text-accent/80 text-sm">
            View All Questions →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredQAs.map((section) => (
            <FeaturedQACard
              key={`${section.volume}-${section.id}`}
              section={section}
              volumeNumber={section.volume}
            />
          ))}
        </div>
      </section>

      {/* Quick Access Features */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold text-ink text-center mb-8">Explore More</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/search"
            className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl 



                     transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center



                          group-hover:bg-accent/20 transition-colors duration-200"
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-xl text-accent"
                />
              </div>

              <h3 className="text-xl font-bold text-ink">Search SBS</h3>
            </div>

            <p className="text-gray-600">
              Search through all SBS questions and answers with our powerful
              search feature.
            </p>
          </Link>

          <Link
            to="/browse"
            className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl 



                     transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center



                          group-hover:bg-accent/20 transition-colors duration-200"
              >
                <FontAwesomeIcon
                  icon={faFilter}
                  className="text-xl text-accent"
                />
              </div>

              <h3 className="text-xl font-bold text-ink">Browse Content</h3>
            </div>

            <p className="text-gray-600">
              Explore SBS content organized by volumes and chapters.
            </p>
          </Link>

          <div
            className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl 



                      transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center



                          group-hover:bg-accent/20 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faUser} className="text-xl text-accent" />
              </div>

              <h3 className="text-xl font-bold text-ink">Character Info</h3>
            </div>

            <p className="text-gray-600">
              Coming soon: Detailed character profiles and information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
