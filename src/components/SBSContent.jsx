import React from "react";

import { useSBS } from "../contexts/SBSContext";

import QAGroup from "./QAGroup";

function SBSContent() {
  const { filteredData, searchTerm } = useSBS();

  // Add null check for filteredData

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        {searchTerm
          ? `No results found for "${searchTerm}"`
          : "No content available"}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      {filteredData.map((qaGroup, index) => (
        <QAGroup key={index} qaGroup={qaGroup} />
      ))}
    </div>
  );
}

export default SBSContent;
