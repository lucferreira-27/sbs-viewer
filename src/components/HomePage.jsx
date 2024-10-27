import React from "react";

import { useSBS } from "../contexts/SBSContext";

import QAPair from "./QAPair";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faSearch,
  faFilter,
  faUser,
  faArrowRight,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";

function HomePage() {
  const { sbs_data, currentVolume } = useSBS();

  // Get the first 3 sections from the current volume's chapters

  const featuredQAs =
    sbs_data[currentVolume]?.chapters
      ?.slice(0, 1) // Take first chapter
      ?.flatMap(
        (chapter) =>
          chapter.sections
            .filter((section) => section.type === "q&a")
            .slice(0, 3) // Take first 3 QA sections
      ) || [];
  console.log(sbs_data[currentVolume]?.chapters?.slice(0, 1));

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4">
      {/* Hero Section */}

      <section className="relative py-20 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-ink mb-6 bg-gradient-to-r from-ink to-accent bg-clip-text text-transparent">
            One Piece SBS Explorer
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover Oda's answers to fan questions, character insights, and
            behind-the-scenes details
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/search"
              className="inline-flex items-center px-8 py-4 bg-accent text-white rounded-xl
                       hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/20
                       transform hover:-translate-y-0.5"
            >
              Start Exploring
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Q&As */}

      <section className="space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faQuoteLeft}
              className="text-xl text-accent"
            />
          </div>

          <h2 className="text-3xl font-bold text-ink">Featured Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredQAs.length > 0 ? (
            featuredQAs.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl 
                         transition-all duration-300 transform hover:-translate-y-1
                         border border-gray-100 overflow-hidden"
              >
                <QAPair section={section} compact={true} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-gray-50 rounded-2xl text-gray-500">
              <FontAwesomeIcon
                icon={faQuoteLeft}
                className="text-4xl text-gray-300 mb-4"
              />

              <p className="text-lg">
                No featured questions available for this volume.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Access Features */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </section>
    </div>
  );
}

export default HomePage;
