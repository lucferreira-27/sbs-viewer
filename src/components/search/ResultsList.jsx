import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import SBSContent from "../shared/SBSContent";

function ResultsList({
  searchStats,

  searchTerm,

  selectedVolume,

  isLoadingMore,

  loadMoreRef,
}) {
  return (
    <div className="transition-all duration-300 mt-4">
      <SBSContent searchMode={true} filterVolume={selectedVolume} />

      {/* Load More Trigger */}

      {searchStats && searchStats.totalMatches > 0 && !selectedVolume && (
        <div ref={loadMoreRef} className="py-4 text-center">
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
  );
}

export default ResultsList;
