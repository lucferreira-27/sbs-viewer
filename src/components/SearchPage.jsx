import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import SearchBar from "./SearchBar";

import SBSContent from "./SBSContent";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faSearch,
  faInfoCircle,
  faSpinner,
  faBook,
  faFilter,
  faTimes,
  faChevronDown,
  faChevronUp,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";

import { useSBS } from "../contexts/SBSContext";

function SearchPage() {
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [isSticky, setIsSticky] = useState(true);
  const {
    searchTerm,
    isSearching,
    searchStats,
    loadMoreResults,
    isLoadingMore,
  } = useSBS();

  // Set up intersection observer for infinite loading
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      loadMoreResults();
    }
  }, [inView]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Search Header */}
      <div
        className={`${
          isSticky
            ? "sticky top-16 bg-gray-50/80 backdrop-blur-sm -mx-4 px-4 shadow-sm"
            : ""
        } z-50 py-4 transition-all duration-300`}
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <SearchBar isFixed={isSticky} />
            {/* Sticky Toggle */}
            <button
              onClick={() => setIsSticky(!isSticky)}
              className={`absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors
                ${
                  isSticky
                    ? "text-accent bg-accent/5 hover:bg-accent/10"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              title={isSticky ? "Unpin search bar" : "Pin search bar"}
            >
              <FontAwesomeIcon
                icon={faThumbtack}
                className={`transition-transform ${
                  !isSticky ? "rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`mt-2 ${isSticky ? "pt-2" : ""}`}>
        {/* Search Tips (only show when no search or results) */}
        {(!searchTerm || !searchStats) && !isSearching && (
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 max-w-3xl mx-auto">
            <div className="flex items-start gap-3 text-sm">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="text-blue-500 mt-1"
              />
              <ul className="text-blue-600 space-y-1">
                <li>• Use keywords related to characters, places, or events</li>
                <li>• Try variations like "Luffy" or "Monkey D. Luffy"</li>
                <li>
                  • Search specific topics like "Devil Fruit" or "birthday"
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Compact Search Stats with Volume Filter */}
        {searchStats && searchTerm && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Stats Header - Always visible */}
              <button
                onClick={() => setShowStats(!showStats)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faBook} className="text-accent" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium text-accent">
                      {searchStats.totalMatches}
                    </span>{" "}
                    matches in{" "}
                    <span className="font-medium text-accent">
                      {searchStats.volumeCount}
                    </span>{" "}
                    volumes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedVolume && (
                    <span className="text-xs bg-accent/5 text-accent px-2 py-1 rounded-full">
                      Volume {selectedVolume}
                    </span>
                  )}
                  <FontAwesomeIcon
                    icon={showStats ? faChevronUp : faChevronDown}
                    className="text-gray-400 w-4 h-4"
                  />
                </div>
              </button>

              {/* Collapsible Volume Grid */}
              {showStats && (
                <div className="px-4 pb-3 border-t border-gray-100">
                  <div className="pt-3 flex flex-wrap gap-1">
                    {Object.entries(searchStats.volumes)
                      .sort((a, b) => b[1] - a[1])
                      .map(([volume, count]) => (
                        <button
                          key={volume}
                          onClick={() =>
                            setSelectedVolume(
                              selectedVolume === parseInt(volume)
                                ? null
                                : parseInt(volume)
                            )
                          }
                          className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                            selectedVolume === parseInt(volume)
                              ? "bg-accent text-white"
                              : "bg-gray-50 text-gray-600 hover:bg-accent/10 hover:text-accent"
                          }`}
                        >
                          {volume} ({count})
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="transition-all duration-300 mt-4">
          <SBSContent searchMode={true} filterVolume={selectedVolume} />
        </div>

        {/* Load More Trigger */}
        {searchStats && searchStats.totalMatches > 0 && !selectedVolume && (
          <div ref={ref} className="py-4 text-center">
            {isLoadingMore ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-accent animate-spin"
              />
            ) : (
              <span className="text-xs text-gray-400">Scroll to load more</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
