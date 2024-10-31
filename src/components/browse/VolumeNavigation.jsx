import React from "react";

function VolumeNavigation({ currentVolume, availableVolumes, onVolumeChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Currently viewing:</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onVolumeChange("prev")}
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
            onClick={() => onVolumeChange("next")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              availableVolumes.indexOf(currentVolume) < availableVolumes.length - 1
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
  );
}

export default VolumeNavigation; 