import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSBS } from "../contexts/SBSContext";
import VolumeHeader from "../components/browse/VolumeHeader";
import VolumeNavigation from "../components/browse/VolumeNavigation";
import ChapterList from "../components/browse/ChapterList";

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

    setIsLoading(true);
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
      <VolumeHeader currentVolume={currentVolume} />

      <VolumeNavigation
        currentVolume={currentVolume}
        availableVolumes={availableVolumes}
        onVolumeChange={handleVolumeChange}
      />

      <ChapterList
        isLoading={isLoading}
        currentVolumeData={currentVolumeData}
        currentVolume={currentVolume}
      />
    </div>
  );
}

export default BrowsePage;
