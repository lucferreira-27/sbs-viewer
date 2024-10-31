import React, { useState } from "react";
import QAPair from "./QAPair";
import { useSBS } from "../contexts/SBSContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShare,
  faCamera,
  faLink,
  faBookOpen,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import html2canvas from "html2canvas";

function QAGroup({ qaGroup, searchMode = false, searchTerm = "" }) {
  const { currentVolume } = useSBS();
  const [isCapturing, setIsCapturing] = useState(false);

  console.log("🔍 QAGroup received:", { qaGroup, searchMode, searchTerm });

  if (!qaGroup || !qaGroup.chapters) {
    console.log("❌ Invalid qaGroup data:", qaGroup);
    return null;
  }

  // Render each chapter's content
  return (
    <>
      {qaGroup.chapters.map((chapter, chapterIndex) => {
        const { chapter: chapterNumber, page, sections } = chapter;
        const groupId = `vol${
          qaGroup.volume || currentVolume
        }-ch${chapterNumber}-p${page}`;

        return (
          <div
            key={chapterIndex}
            id={groupId}
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl
              ${searchMode ? "search-result" : ""}`}
          >
            {/* Header with Meta Information */}
            <div className="bg-accent/10 px-6 py-4">
              <div className="flex justify-between items-center">
                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faBookOpen}
                      className="text-accent"
                    />
                    <span className="font-medium text-accent">
                      Volume {qaGroup.volume || currentVolume}
                    </span>
                  </div>
                  {page && (
                    <div className="flex items-center">
                      <span className="text-gray-600">Page {page}</span>
                    </div>
                  )}
                  {chapterNumber && (
                    <div className="flex items-center">
                      <span className="text-gray-600">
                        Chapter {chapterNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleScreenshot(groupId)}
                    disabled={isCapturing}
                    className="p-2 rounded-lg hover:bg-accent/20 text-accent transition-colors disabled:opacity-50"
                    title="Take Screenshot"
                  >
                    <FontAwesomeIcon
                      icon={isCapturing ? faSpinner : faCamera}
                      className={isCapturing ? "animate-spin" : ""}
                    />
                  </button>
                  <button
                    onClick={() => copyLink(groupId)}
                    className="p-2 rounded-lg hover:bg-accent/20 text-accent transition-colors"
                    title="Copy Link"
                  >
                    <FontAwesomeIcon icon={faLink} />
                  </button>
                  <button
                    onClick={() => openFandom(qaGroup.volume || currentVolume)}
                    className="p-2 rounded-lg hover:bg-accent/20 text-accent transition-colors"
                    title="View on One Piece Wiki"
                  >
                    <FontAwesomeIcon icon={faShare} />
                  </button>
                </div>

                {searchMode && searchTerm && (
                  <div className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">
                    Search result for "{searchTerm}"
                  </div>
                )}
              </div>
            </div>

            {/* Q&A Content */}
            <div className="divide-y divide-gray-100">
              {sections && sections.length > 0 ? (
                sections
                  .filter((section) => section && section.type === "q&a")
                  .map((section, index) => {
                    console.log("🔖 Rendering section:", section);
                    return (
                      <div key={`${section.id || index}`} className="p-6">
                        <QAPair
                          section={section}
                          searchMode={searchMode}
                          searchTerm={searchTerm}
                        />
                      </div>
                    );
                  })
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No Q&A content available
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default QAGroup;
