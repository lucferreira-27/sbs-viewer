import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSBS } from "../contexts/SBSContext";
import SearchBar from "../components/search/SearchBar";
import SearchStats from "../components/search/SearchStats";
import SearchFilters from "../components/search/SearchFilters";
import ResultsList from "../components/search/ResultsList";

function SearchPage() {
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [showStats, setShowStats] = useState(true);

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
      <div className="py-4">
        <div className="max-w-3xl mx-auto">
          <SearchBar />
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-2">
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
