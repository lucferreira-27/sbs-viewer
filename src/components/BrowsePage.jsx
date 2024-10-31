import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSBS } from "../contexts/SBSContext";
import QAGroup from "./QAGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faChevronRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

function BrowsePage() {
  const { volumeId } = useParams();
  const navigate = useNavigate();
  const { sbs_data, currentVolume, setCurrentVolume, availableVolumes } =
    useSBS();
  const [isLoading, setIsLoading] = useState(true);

  // Update current volume when URL changes
  useEffect(() => {
    if (!volumeId) {
      navigate(`/browse/${availableVolumes[0]}`, { replace: true });
      return;
    }

    setIsLoading(true); // Start loading
    const volumeNumber = parseInt(volumeId);
    setCurrentVolume(volumeNumber);

    // Simulate loading delay for smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [volumeId, setCurrentVolume, navigate]);

  const currentVolumeData = sbs_data[currentVolume];

  // Handle volume navigation
  const handleVolumeChange = (direction) => {
    const currentIndex = availableVolumes.indexOf(currentVolume);
    if (direction === "prev" && currentIndex > 0) {
      navigate(`/browse/${availableVolumes[currentIndex - 1]}`);
    } else if (
      direction === "next" &&
      currentIndex < availableVolumes.length - 1
    ) {
      navigate(`/browse/${availableVolumes[currentIndex + 1]}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* Browse Header */}
      <div className="flex items-center gap-4 mb-8 animate-fade-in">
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faBook} className="text-xl text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-ink">Browse SBS Content</h1>
          <div className="flex items-center text-gray-600 mt-1">
            <span>Volume</span>
            <FontAwesomeIcon icon={faChevronRight} className="mx-2 text-xs" />
            <span className="font-medium text-accent">
              Volume {currentVolume}
            </span>
          </div>
        </div>
      </div>

      {/* Volume Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Currently viewing:</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleVolumeChange("prev")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                availableVolumes.indexOf(currentVolume) > 0
                  ? "text-accent hover:bg-accent/10"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              disabled={availableVolumes.indexOf(currentVolume) === 0}
            >
              Previous Volume
            </button>
            <span className="font-medium">Volume {currentVolume}</span>
            <button
              onClick={() => handleVolumeChange("next")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                availableVolumes.indexOf(currentVolume) <
                availableVolumes.length - 1
                  ? "text-accent hover:bg-accent/10"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              disabled={
                availableVolumes.indexOf(currentVolume) ===
                availableVolumes.length - 1
              }
            >
              Next Volume
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="bg-gray-100 px-6 py-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Q&A Content */
        <div className="space-y-6">
          {currentVolumeData && currentVolumeData.chapters ? (
            currentVolumeData.chapters.map((chapter, index) => (
              <div
                key={index}
                className="opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <QAGroup
                  qaGroup={{ volume: currentVolume, chapters: [chapter] }}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-2xl animate-fade-in">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-4xl text-gray-300 mb-4 animate-spin"
              />
              <p className="text-lg">
                No content available for Volume {currentVolume}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BrowsePage;
