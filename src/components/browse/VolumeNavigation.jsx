import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faSpinner,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

function VolumeNavigation({
  currentVolume,
  availableVolumes,
  onVolumeChange,
  coverUrl,
}) {
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageUrl, setImageUrl] = React.useState("");
  const [error, setError] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  // Preload image
  React.useEffect(() => {
    setImageLoading(true);
    setIsVisible(false);
    setError(false);

    // Only attempt to load if we have a coverUrl
    if (coverUrl) {
      const img = new Image();

      img.onload = () => {
        setImageUrl(coverUrl);
        setImageLoading(false);
        // Slight delay before showing the image for smooth transition
        setTimeout(() => setIsVisible(true), 50);
      };

      img.onerror = () => {
        setError(true);
        setImageLoading(false);
        setIsVisible(true);
      };

      img.src = coverUrl;
    } else {
      setImageLoading(false);
      setIsVisible(true);
    }
  }, [coverUrl]);

  return (
    <div className="space-y-4">
      {/* Cover Image Container */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="aspect-[2/3] relative rounded overflow-hidden bg-gray-50">
          {/* Loading Spinner */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              imageLoading || coverUrl === undefined
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <FontAwesomeIcon
              icon={faSpinner}
              className="text-2xl text-accent animate-spin"
            />
          </div>

          {/* Image or Fallback */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {imageUrl && !error ? (
              <div
                className="w-full h-full transform transition-all duration-300 hover:scale-105"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <FontAwesomeIcon icon={faImage} className="text-3xl" />
                <span className="text-sm">
                  {error ? "Failed to load cover" : "No cover available"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Volume Navigation */}
      <nav className="bg-white rounded-lg shadow-sm">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onVolumeChange("prev")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                availableVolumes.indexOf(currentVolume) > 0
                  ? "text-accent hover:bg-accent/5 active:scale-95"
                  : "text-gray-300"
              }`}
              disabled={availableVolumes.indexOf(currentVolume) === 0}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              <span className="text-sm hidden sm:inline">Previous</span>
            </button>

            <span className="font-medium">Volume {currentVolume}</span>

            <button
              onClick={() => onVolumeChange("next")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                availableVolumes.indexOf(currentVolume) <
                availableVolumes.length - 1
                  ? "text-accent hover:bg-accent/5 active:scale-95"
                  : "text-gray-300"
              }`}
              disabled={
                availableVolumes.indexOf(currentVolume) ===
                availableVolumes.length - 1
              }
            >
              <span className="text-sm hidden sm:inline">Next</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default VolumeNavigation;
