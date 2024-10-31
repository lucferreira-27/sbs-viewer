import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { useSBS } from "../contexts/SBSContext";
import SearchBar from "../components/search/SearchBar";
import SearchStats from "../components/search/SearchStats";
import SearchFilters from "../components/search/SearchFilters";
import ResultsList from "../components/search/ResultsList";

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

  const { ref: loadMoreRef, inView } = useInView({
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
        <SearchFilters searchTerm={searchTerm} searchStats={searchStats} />

        {searchStats && searchTerm && (
          <SearchStats
            searchStats={searchStats}
            selectedVolume={selectedVolume}
            showStats={showStats}
            setShowStats={setShowStats}
            onVolumeSelect={setSelectedVolume}
          />
        )}

        <ResultsList
          searchStats={searchStats}
          searchTerm={searchTerm}
          selectedVolume={selectedVolume}
          isLoadingMore={isLoadingMore}
          loadMoreRef={loadMoreRef}
        />
      </div>
    </div>
  );
}

export default SearchPage;
