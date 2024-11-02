import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCircleExclamation,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import QAGroup from "../qa/QAGroup";
import { debug } from "../../utils/debug";

function ChapterList({
  isLoading,
  hasError,
  currentVolumeData,
  currentVolume,
}) {
  debug.log("ChapterList", {
    isLoading,
    hasError,
    "has volume data": !!currentVolumeData,
    "has chapters": !!currentVolumeData?.chapters,
    "chapters length": currentVolumeData?.chapters?.length,
    currentVolume,
  });

  if (isLoading || !currentVolumeData) {
    return (
      <StateMessage
        icon={faSpinner}
        title="Loading chapters..."
        message="Please wait while we fetch the content"
        spinning
      />
    );
  }

  if (hasError || !currentVolumeData.chapters) {
    return (
      <StateMessage
        icon={faCircleExclamation}
        title="Content Not Available"
        message={`We couldn't load the chapters for Volume ${currentVolume}`}
        subMessage="Please try again later or select a different volume"
      />
    );
  }

  if (currentVolumeData.chapters.length === 0) {
    return (
      <StateMessage
        icon={faBookOpen}
        title="No Chapters Found"
        message={`Volume ${currentVolume} doesn't have any chapters yet`}
        subMessage="Please select a different volume"
      />
    );
  }

  return (
    <div className="space-y-4">
      {currentVolumeData.chapters.map((chapter, index) => (
        <div
          key={index}
          className="opacity-0 animate-fade-in"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "forwards",
          }}
        >
          <div className="bg-white rounded-lg shadow-sm transition-transform hover:translate-y-[-2px]">
            <QAGroup qaGroup={{ volume: currentVolume, chapters: [chapter] }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StateMessage({ icon, title, message, subMessage, spinning = false }) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 bg-gray-50 rounded-2xl animate-fade-in">
      <FontAwesomeIcon
        icon={icon}
        className={`text-4xl mb-4 text-accent ${
          spinning ? "animate-spin" : ""
        }`}
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-1">{message}</p>
      {subMessage && <p className="text-sm text-gray-500">{subMessage}</p>}
    </div>
  );
}

export default ChapterList;
