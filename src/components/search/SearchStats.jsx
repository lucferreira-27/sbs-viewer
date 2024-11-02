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
    <div className="max-w-3xl mx-auto mb-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Stats Header */}
        <button
          onClick={() => setShowStats(!showStats)}
          className={`
            w-full flex items-center justify-between transition-all duration-300
            hover:bg-gray-50/80
            ${showStats ? "px-6 py-4" : "px-4 py-3"}
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`
              rounded-lg bg-accent/[0.08] flex items-center justify-center transition-all duration-300
              ${showStats ? "w-8 h-8" : "w-6 h-6"}
            `}
            >
              <FontAwesomeIcon
                icon={faBook}
                className={`
                  text-accent/90 transition-all duration-300
                  ${showStats ? "text-base" : "text-sm"}
                `}
              />
            </div>
            <div
              className={`
              text-gray-600 transition-all duration-300
              ${showStats ? "text-sm" : "text-xs"}
            `}
            >
              <span className="font-medium text-gray-800">
                {searchStats.totalMatches}
              </span>{" "}
              {searchStats.totalMatches === 1 ? "match" : "matches"} in{" "}
              <span className="font-medium text-gray-800">
                {searchStats.volumeCount}
              </span>{" "}
              {searchStats.volumeCount === 1 ? "volume" : "volumes"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedVolume && (
              <span
                className={`
                bg-accent/[0.08] text-accent/90 px-2.5 rounded-full font-medium transition-all duration-300
                ${showStats ? "text-xs py-1" : "text-[10px] py-0.5"}
              `}
              >
                Vol. {selectedVolume}
              </span>
            )}
            <FontAwesomeIcon
              icon={showStats ? faChevronUp : faChevronDown}
              className={`
                text-gray-400 transition-all duration-300 transform
                ${showStats ? "rotate-0" : "rotate-0"}
                ${showStats ? "w-4 h-4" : "w-3 h-3"}
              `}
            />
          </div>
        </button>

        {/* Volume Grid */}
        <div
          className={`
          transition-all duration-300 ease-in-out origin-top
          ${
            showStats
              ? "opacity-100 max-h-96 border-t border-gray-100"
              : "opacity-0 max-h-0 border-t-0"
          }
        `}
        >
          <div
            className={`
            px-6 pb-4 pt-2 bg-gray-50/30
            transition-all duration-300
            ${showStats ? "opacity-100" : "opacity-0"}
          `}
          >
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(searchStats.volumes)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([volume, count]) => {
                  const isSelected = selectedVolume === parseInt(volume);
                  return (
                    <button
                      key={volume}
                      onClick={() =>
                        onVolumeSelect(isSelected ? null : parseInt(volume))
                      }
                      className={`
                        px-2.5 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-200
                        flex items-center gap-1.5 select-none
                        ${
                          isSelected
                            ? "bg-accent/95 text-white shadow-sm transform scale-105"
                            : "bg-white text-gray-700 hover:bg-accent/[0.08] hover:text-accent/90 border border-gray-200/80"
                        }
                      `}
                    >
                      <span>{volume}</span>
                      <span
                        className={`
                          transition-colors duration-200
                          ${isSelected ? "text-white/90" : "text-gray-400"}
                        `}
                      >
                        ({count})
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchStats;
