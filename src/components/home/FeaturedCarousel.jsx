import React, { useState, useEffect, useCallback } from "react";

import useEmblaCarousel from "embla-carousel-react";

import Autoplay from "embla-carousel-autoplay";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChevronLeft,
  faChevronRight,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";

import FeaturedQACard from "./FeaturedQACard";

function FeaturedCarousel({ featuredQAs }) {
  const autoplayOptions = {
    delay: 4000,

    stopOnInteraction: false,

    stopOnMouseEnter: true,

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

  const [isHovered, setIsHovered] = useState(false);

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

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    setScrollSnaps(emblaApi.scrollSnapList());

    emblaApi.on("select", onSelect);

    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
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
        {/* Carousel Content */}

        <div className="overflow-hidden rounded-xl px-4" ref={emblaRef}>
          <div className="flex touch-pan-y backface-hidden -ml-4">
            {featuredQAs.map((section) => (
              <div
                key={`${section.volume}-${section.id}`}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.33%] pl-4"
              >
                <div className="p-2">
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

        {/* Navigation Buttons */}

        <CarouselNavigation onPrev={scrollPrev} onNext={scrollNext} />

        {/* Progress Dots */}

        <CarouselDots
          snapCount={scrollSnaps.length}
          selectedIndex={selectedIndex}
          onDotClick={scrollTo}
        />
      </div>
    </section>
  );
}

function CarouselNavigation({ onPrev, onNext }) {
  return (
    <>
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 







                 bg-white/90 rounded-full p-3







                 text-accent/60 hover:text-accent







                 transition-colors duration-200 







                 opacity-0 group-hover:opacity-100







                 shadow-sm ml-2"
        onClick={onPrev}
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
        onClick={onNext}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </>
  );
}

function CarouselDots({ snapCount, selectedIndex, onDotClick }) {
  return (
    <div className="flex justify-center gap-3 mt-8 mb-2">
      {Array.from({ length: snapCount }).map((_, index) => (
        <button
          key={index}
          className={`h-1.5 rounded-full transition-all duration-300 







            ${
              index === selectedIndex
                ? "bg-accent w-8"
                : "bg-accent/20 w-1.5 hover:bg-accent/40"
            }`}
          onClick={() => onDotClick(index)}
        />
      ))}
    </div>
  );
}

export default FeaturedCarousel;
