import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import QAGroup from "../qa/QAGroup";

function ChapterList({ isLoading, currentVolumeData, currentVolume }) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!currentVolumeData?.chapters) {
    return <EmptyState currentVolume={currentVolume} />;
  }

  return (
    <div className="space-y-6">
      {currentVolumeData.chapters.map((chapter, index) => (
        <div
          key={index}
          className="opacity-0 animate-fade-in"
          style={{
            animationDelay: `${index * 150}ms`,
            animationFillMode: "forwards",
          }}
        >
          <QAGroup qaGroup={{ volume: currentVolume, chapters: [chapter] }} />
        </div>
      ))}
    </div>
  );
}

function LoadingState() {
  return (
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
  );
}

function EmptyState({ currentVolume }) {
  return (
    <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-2xl animate-fade-in">
      <FontAwesomeIcon
        icon={faSpinner}
        className="text-4xl text-gray-300 mb-4 animate-spin"
      />
      <p className="text-lg">No content available for Volume {currentVolume}</p>
    </div>
  );
}

export default ChapterList;
