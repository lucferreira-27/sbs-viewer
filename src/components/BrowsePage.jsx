import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSBS } from "../contexts/SBSContext";
import QAGroup from "./QAGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function BrowsePage() {
  const { volumeId } = useParams();
  const navigate = useNavigate();
  const { sbs_data, currentVolume, setCurrentVolume, availableVolumes } =
    useSBS();

  // Update current volume when URL changes
  useEffect(() => {
    if (!volumeId) {
      // Only redirect if no volumeId is provided
      navigate(`/browse/${availableVolumes[0]}`, { replace: true });
      return;
    }

    const volumeNumber = parseInt(volumeId);
    setCurrentVolume(volumeNumber);
  }, [volumeId, setCurrentVolume, navigate]);

  const currentVolumeData = sbs_data[currentVolume]?.chapters || [];

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
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      {/* Browse Header */}
      <div className="flex items-center gap-4 mb-8">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
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

      {/* Q&A Content */}
      <div className="space-y-6">
        {currentVolumeData.map((chapter, index) => (
          <QAGroup key={index} qaGroup={chapter} />
        ))}
        {currentVolumeData.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No content available for Volume {currentVolume}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowsePage;
