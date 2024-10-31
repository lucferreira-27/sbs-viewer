import React from "react";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function HeroSection() {
  return (
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
  );
}

export default HeroSection;
