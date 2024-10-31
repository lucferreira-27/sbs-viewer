import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSBS } from "../contexts/SBSContext";
import FeaturedQACard from "./FeaturedQACard";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faUser,
  faArrowRight,
  faQuoteLeft,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function HomePage() {
  const { sbs_data, availableVolumes } = useSBS();
  const [featuredQAs, setFeaturedQAs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced Embla setup with modified autoplay plugin
  const autoplayOptions = {
    delay: 4000,
    stopOnInteraction: false, // Don't stop on click/drag
    stopOnMouseEnter: true, // Always stop on hover
    rootNode: (emblaRoot) => emblaRoot.parentElement,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      inViewThreshold: 0.7,
      dragFree: true,
      containScroll: "trimSnaps",
      slidesToScroll: 1,
      breakpoints: {
        "(max-width: 768px)": {
          align: "center",
          containScroll: "keepSnaps",
        },
      },
    },
    [Autoplay(autoplayOptions)]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Initialize Embla
  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);

    // Auto-play setup
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

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

  // Add hover state for better control
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen">
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
            Dive into Oda's fascinating answers, character insights, and
            behind-the-scenes details from the SBS (Question Corner) sections.
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

      {/* Featured Questions - Modified shadow effects */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-accent text-2xl">❝</span>
            <h2 className="text-xl font-bold text-ink">Featured Questions</h2>
          </div>
        </div>

        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden rounded-xl px-4" ref={emblaRef}>
            <div className="flex touch-pan-y backface-hidden -ml-4">
              {featuredQAs.map((section) => (
                <div
                  key={`${section.volume}-${section.id}`}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.33%] pl-4"
                >
                  <div className="p-2">
                    {/* Adjusted shadow and border radius to match card */}
                    <div className="transition-shadow duration-300 rounded-2xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                      <FeaturedQACard
                        section={section}
                        volumeNumber={section.volume}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Reduced shadow */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                     bg-white/90 rounded-full p-3
                     text-accent/60 hover:text-accent
                     transition-colors duration-200 
                     opacity-0 group-hover:opacity-100
                     shadow-sm ml-2"
            onClick={scrollPrev}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                     bg-white/90 rounded-full p-3
                     text-accent/60 hover:text-accent
                     transition-colors duration-200 
                     opacity-0 group-hover:opacity-100
                     shadow-sm mr-2"
            onClick={scrollNext}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          {/* Progress Dots - Added more spacing */}
          <div className="flex justify-center gap-3 mt-8 mb-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 
                  ${
                    index === selectedIndex
                      ? "bg-accent w-8"
                      : "bg-accent/20 w-1.5 hover:bg-accent/40"
                  }`}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Features - Improved */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold text-ink text-center mb-8">
          Explore More
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/search"
            className="group relative p-8 bg-white rounded-2xl border border-gray-100
                       hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                       transition-all duration-300"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center
                               group-hover:bg-accent/10 transition-colors duration-200"
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="text-2xl text-accent"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-ink group-hover:text-accent transition-colors">
                    Search SBS
                  </h3>
                </div>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-accent/40 group-hover:text-accent group-hover:translate-x-1
                             transition-all duration-200 opacity-0 group-hover:opacity-100"
                />
              </div>
              <p className="text-gray-600 leading-relaxed">
                Search through all SBS questions and answers with our powerful
                search feature.
              </p>
            </div>
          </Link>

          <Link
            to="/browse"
            className="group relative p-8 bg-white rounded-2xl border border-gray-100
                       hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                       transition-all duration-300"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center
                               group-hover:bg-accent/10 transition-colors duration-200"
                >
                  <FontAwesomeIcon
                    icon={faFilter}
                    className="text-2xl text-accent"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-ink group-hover:text-accent transition-colors">
                    Browse Content
                  </h3>
                </div>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-accent/40 group-hover:text-accent group-hover:translate-x-1
                             transition-all duration-200 opacity-0 group-hover:opacity-100"
                />
              </div>
              <p className="text-gray-600 leading-relaxed">
                Explore SBS content organized by volumes and chapters.
              </p>
            </div>
          </Link>

          <div
            className="group relative p-8 bg-white rounded-2xl border border-gray-100
                          hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                          transition-all duration-300"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center
                               group-hover:bg-accent/10 transition-colors duration-200"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-2xl text-accent"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-ink group-hover:text-accent transition-colors">
                    Character Info
                  </h3>
                </div>
                <div className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
                  Coming Soon
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Detailed character profiles and information from SBS sections.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
