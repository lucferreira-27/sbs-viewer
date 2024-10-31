import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

function SearchStats({
  searchStats,
  selectedVolume,
  showStats,
  setShowStats,
  onVolumeSelect,
}) {
  if (!searchStats) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Stats Header */}
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

        {/* Volume Grid */}
        {showStats && (
          <div className="px-4 pb-3 border-t border-gray-100">
            <div className="pt-3 flex flex-wrap gap-1">
              {Object.entries(searchStats.volumes)
                .sort((a, b) => b[1] - a[1])
                .map(([volume, count]) => (
                  <button
                    key={volume}
                    onClick={() =>
                      onVolumeSelect(
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
  );
}

export default SearchStats;
