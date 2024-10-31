import React from "react";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faArrowRight,
  faImage,
  faBookOpen,
  faMapPin,
  faTag,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";

function FeaturedQACard({ section, volumeNumber }) {
  if (!section) return null;

  const { question, answer, id } = section;

  return (
    <article
      className="group relative bg-white rounded-2xl overflow-hidden

                      transition-all duration-300 hover:-translate-y-1 hover:shadow-xl

                      border border-gray-100 min-h-[480px] flex flex-col"
    >
      {/* Volume Badge - Floating */}

      <div className="absolute top-4 right-4 z-10">
        <div
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full

                        shadow-sm border border-gray-100"
        >
          <FontAwesomeIcon icon={faBookOpen} className="text-accent/60" />

          <span className="text-sm font-medium text-gray-700">
            Vol. {volumeNumber}
          </span>

          <span className="text-xs font-mono text-gray-400">
            #{id || "SBS"}
          </span>
        </div>
      </div>

      {/* Question Section */}

      <div className="relative px-6 pt-16 pb-8 bg-gradient-to-b from-accent/5 to-transparent">
        <div className="absolute top-8 left-6 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faQuoteLeft} className="text-accent/60" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xl" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-700">
                {question?.author || "Fan"}
              </h3>

              {question?.location && (
                <span
                  className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50/80 

                              px-2 py-0.5 rounded-full"
                >
                  <FontAwesomeIcon
                    icon={faMapPin}
                    className="text-gray-400"
                    size="xs"
                  />

                  {question.location}
                </span>
              )}
            </div>

            <span className="text-xs text-gray-500">Question</span>
          </div>
        </div>

        <p className="text-xl text-gray-900 leading-relaxed line-clamp-2 font-medium">
          "{question?.text}"
        </p>
      </div>

      {/* Oda's Response */}

      <div className="flex-grow px-6 py-8 relative">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent/20">
              <img
                src="/oda/picture.png"
                alt="Oda"
                className="w-full h-full object-cover"
              />
            </div>

            {answer?.type && (
              <span
                className="absolute -bottom-1 -right-1 text-xs bg-accent/10 text-accent 

                            px-2 py-0.5 rounded-full border border-accent/10"
              >
                {answer.type}
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-accent">Oda's Response</span>
            </div>

            <p className="text-gray-600 leading-relaxed line-clamp-3">
              {answer?.segments?.[0]?.text || "No response available"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            {section.tags?.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-xs bg-white 

                             text-gray-600 px-3 py-1.5 rounded-full border border-gray-100"
              >
                <FontAwesomeIcon
                  icon={faTag}
                  className="text-gray-400"
                  size="xs"
                />

                {tag}
              </span>
            ))}

            {section.tags?.length > 2 && (
              <span className="text-xs text-gray-400 px-2">
                +{section.tags.length - 2} more
              </span>
            )}
          </div>

          {answer?.images?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/5 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faImage}
                  size="xs"
                  className="text-accent"
                />
              </span>

              <span className="text-xs text-gray-500">
                {answer.images.length} illustration
                {answer.images.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <Link
          to={`/browse/${volumeNumber}#${id}`}
          className="group/link flex items-center justify-center gap-2 w-full py-2.5 

                       text-accent font-medium rounded-xl

                       hover:bg-accent/5 transition-colors"
        >
          Read Full Q&A
          <FontAwesomeIcon
            icon={faArrowRight}
            className="transition-transform group-hover/link:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}

export default FeaturedQACard;
