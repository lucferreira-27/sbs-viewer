import React from "react";
import { useSBS } from "../../contexts/SBSContext";
import QAGroup from "../qa/QAGroup";

function SBSContent({ searchMode = false, filterVolume = null }) {
  const { filteredData, searchTerm } = useSBS();

  console.log("🎯 SBSContent render:", {
    searchMode,
    searchTerm,
    filteredData,
    dataType: typeof filteredData,
    isArray: Array.isArray(filteredData),
  });

  if (!filteredData) {
    console.log("❌ No filtered data available");
    return (
      <div className="text-center text-gray-500 mt-8">
        {searchTerm
          ? `No results found for "${searchTerm}"`
          : "No content available"}
      </div>
    );
  }

  // Convert filteredData to array format if it's an object
  const dataArray = Array.isArray(filteredData)
    ? filteredData
    : Object.values(filteredData);

  console.log("📊 Processed data array:", dataArray);

  if (dataArray.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        {searchTerm
          ? `No results found for "${searchTerm}"`
          : "No content available"}
      </div>
    );
  }

  // Filter by volume if specified
  const processedData =
    searchMode && searchTerm
      ? dataArray
          .filter((qaGroup) => !filterVolume || qaGroup.volume === filterVolume)
          .map((qaGroup) => ({
            ...qaGroup,
            chapters: qaGroup.chapters
              .filter((chapter) => chapter && chapter.sections)
              .map((chapter) => ({
                ...chapter,
                sections: chapter.sections.filter((section) => {
                  if (!section || section.type !== "q&a") return false;

                  // Search in question text
                  const questionMatch = section.question?.text
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

                  // Search in answer segments
                  const answerMatch = section.answer?.segments?.some(
                    (segment) =>
                      segment.type === "text" &&
                      segment.text
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  );

                  return questionMatch || answerMatch;
                }),
              }))
              .filter((chapter) => chapter.sections.length > 0),
          }))
          .filter((qaGroup) => qaGroup.chapters.length > 0)
      : dataArray;

  return (
    <div className="mt-8 space-y-8">
      {processedData.map((qaGroup, index) => (
        <QAGroup
          key={index}
          qaGroup={qaGroup}
          searchMode={searchMode}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
}

export default SBSContent;
