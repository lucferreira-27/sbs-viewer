import React from "react";
import { useSBS } from "../../contexts/SBSContext";

function VolumeSelector() {
  const { currentVolume, setCurrentVolume, availableVolumes } = useSBS();

  return (
    <select
      value={currentVolume}
      onChange={(e) => setCurrentVolume(Number(e.target.value))}
      className="bg-ink text-paper px-3 py-2 rounded-lg border border-accent/20
                 focus:outline-none focus:ring-2 focus:ring-accent/50
                 cursor-pointer appearance-none"
    >
      {availableVolumes.map((volume) => (
        <option key={volume} value={volume}>
          Volume {volume}
        </option>
      ))}
    </select>
  );
}

export default VolumeSelector;
