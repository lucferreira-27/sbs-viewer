import React from "react";
import QAPair from "./QAPair";
import { useSBS } from "../contexts/SBSContext";

function QAGroup({ qaGroup }) {
  const { currentVolume } = useSBS();

  // Add null check and early return
  if (!qaGroup) return null;

  // Extract chapter info from qaGroup
  const { chapter: chapterNumber, page, sections } = qaGroup;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-accent/10 px-6 py-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <span className="font-medium text-accent">
              Volume {currentVolume}
            </span>
          </div>
          {page && (
            <div className="flex items-center">
              <span className="text-gray-600">Page: {page}</span>
            </div>
          )}
          {chapterNumber && (
            <div className="flex items-center">
              <span className="text-gray-600">Chapter: {chapterNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {sections
          ?.filter((section) => section.type === "q&a")
          .map((section, index) => (
            <div key={index} className="p-6">
              <QAPair section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default QAGroup;
