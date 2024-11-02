import React from "react";
import { useSBS } from "../../contexts/SBSContext";
import QAGroup from "../qa/QAGroup";
import { debug } from "../../utils/debug";

function SBSContent({ searchMode = false, filterVolume = null }) {
  const { filteredData, searchTerm } = useSBS();

  debug.group("SBSContent", () => {
    debug.log("SBSContent", {
      searchMode,
      searchTerm,
      "data type": typeof filteredData,
      "is array": Array.isArray(filteredData),
      "data length": filteredData?.length || 0,
    });
  });

  if (!filteredData) {
    debug.log("SBSContent", "No filtered data available", "warn");
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

  debug.log(
    "SBSContent",
    {
      "processed array length": dataArray.length,
      "first item sample": dataArray[0],
    },
    "info"
  );

  if (dataArray.length === 0) {
    debug.log("SBSContent", "Empty data array", "warn");
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

                  const questionMatch = section.question?.text
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

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

  debug.table("SBSContent", {
    "Original Length": dataArray.length,
    "Processed Length": processedData.length,
    "Filter Volume": filterVolume,
    "Search Mode": searchMode,
    "Search Term": searchTerm,
  });

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
