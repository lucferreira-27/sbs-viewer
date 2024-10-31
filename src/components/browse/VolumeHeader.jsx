import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function VolumeHeader({ currentVolume }) {
  return (
    <div className="flex items-center gap-4 mb-8 animate-fade-in">
      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
        <FontAwesomeIcon icon={faBook} className="text-xl text-accent" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-ink">Browse SBS Content</h1>
        <div className="flex items-center text-gray-600 mt-1">
          <span>Volume</span>
          <FontAwesomeIcon icon={faChevronRight} className="mx-2 text-xs" />
          <span className="font-medium text-accent">Volume {currentVolume}</span>
        </div>
      </div>
    </div>
  );
}

export default VolumeHeader; 