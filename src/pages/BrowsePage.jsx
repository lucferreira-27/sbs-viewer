import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSBS } from "../contexts/SBSContext";
import VolumeHeader from "../components/browse/VolumeHeader";
import VolumeNavigation from "../components/browse/VolumeNavigation";
import ChapterList from "../components/browse/ChapterList";
import { debug } from "../utils/debug";

function BrowsePage() {
  const { volumeId } = useParams();
  const navigate = useNavigate();
  const { sbs_data, currentVolume, setCurrentVolume, availableVolumes } =
    useSBS();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Add state transition logging
  useEffect(() => {
    debug.log(
      "BrowsePage State Change",
      {
        isLoading,
        hasError,
        volumeId,
        currentVolume,
        "has data": !!sbs_data[currentVolume],
        "has chapters": !!sbs_data[currentVolume]?.chapters,
        timestamp: new Date().toISOString(),
      },
      "info"
    );
  }, [isLoading, hasError, volumeId, currentVolume, sbs_data]);

  useEffect(() => {
    debug.log(
      "BrowsePage Effect Start",
      {
        volumeId,
        "initial loading": isLoading,
        "initial error": hasError,
      },
      "info"
    );

    if (!volumeId) {
      navigate(`/browse/${availableVolumes[0]}`, { replace: true });
      return;
    }

    const volumeNumber = parseInt(volumeId);

    // Set loading state
    setIsLoading(true);
    setHasError(false);
    setCurrentVolume(volumeNumber);

    const volumeData = sbs_data[volumeNumber];

    debug.log(
      "BrowsePage Data Check",
      {
        volumeNumber,
        "has data": !!volumeData,
        "has chapters": !!volumeData?.chapters,
        "chapters length": volumeData?.chapters?.length,
      },
      "info"
    );

    // Only proceed with error checking if we have the volume data
    if (volumeData) {
      if (!volumeData.chapters || volumeData.chapters.length === 0) {
        setHasError(true);
        debug.log("BrowsePage", "No chapters found for volume", "warn");
      } else {
        setHasError(false);
      }
      setIsLoading(false);
    }
    // If we don't have volumeData, keep loading state true
  }, [volumeId, setCurrentVolume, navigate, sbs_data, availableVolumes]);

  const currentVolumeData = sbs_data[currentVolume];

  // Debug logging with more relevant info
  console.log("Browse Page State:", {
    volumeId,
    currentVolume,
    isLoading,
    hasError,
    "has data": !!currentVolumeData,
    "has chapters": !!currentVolumeData?.chapters,
    "chapters length": currentVolumeData?.chapters?.length,
  });

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
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <VolumeHeader currentVolume={currentVolume} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              <VolumeNavigation
                currentVolume={currentVolume}
                availableVolumes={availableVolumes}
                onVolumeChange={handleVolumeChange}
                coverUrl={currentVolumeData?.coverUrl}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-9">
            <div className="h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide">
              <ChapterList
                isLoading={isLoading}
                hasError={hasError}
                currentVolumeData={currentVolumeData}
                currentVolume={currentVolume}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowsePage;
