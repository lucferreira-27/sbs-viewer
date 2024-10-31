import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUser } from "@fortawesome/free-solid-svg-icons";

import TextFormatter from "./TextFormatter";

import ImageDisplay from "./ImageDisplay";

function MessageBubble({
  author,

  content,

  type = "text",

  isOda = false,

  hasImage = false,

  searchMode = false,

  searchTerm = "",
}) {
  const getAvatar = () => {
    if (isOda) {
      return (
        <img
          src={hasImage ? "/oda/drawing.png" : "/oda/picture.png"}
          alt="Oda"
          className="w-full h-full object-cover"
        />
      );
    } else if (author) {
      return (
        <img
          src={`/characters/${author.toLowerCase()}.png`}
          alt={`${author}'s avatar`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;

            e.target.parentElement.innerHTML = `

              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">

                <svg class="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">

                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />

                </svg>

              </div>

            `;
          }}
        />
      );
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
          <FontAwesomeIcon icon={faUser} className="text-xl text-accent" />
        </div>
      );
    }
  };

  return (
    <div className="flex items-start gap-4 group hover:bg-gray-50/50 p-3 -mx-3 rounded-xl transition-colors">
      {/* Avatar */}

      <div className="flex-shrink-0">
        <div
          className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all duration-300

          ${
            isOda
              ? hasImage
                ? "border-accent/50 shadow-lg ring-2 ring-accent/20 group-hover:scale-105"
                : "border-accent shadow-md group-hover:shadow-lg"
              : "border-accent/20 group-hover:border-accent/30"
          }`}
        >
          {getAvatar()}
        </div>

        <div className="mt-2 text-center">
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full truncate max-w-[100px] inline-block ${
              isOda
                ? hasImage
                  ? "bg-accent/10 text-accent"
                  : "bg-accent/5 text-accent/90"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {(author || (isOda ? "Oda" : "Guest")).length > 12
              ? `${(author || (isOda ? "Oda" : "Guest")).substring(0, 12)}...`
              : author || (isOda ? "Oda" : "Guest")}
          </span>
        </div>
      </div>

      {/* Content */}

      <div className="flex-grow">
        <div
          className={`rounded-3xl p-5 relative transition-all duration-300 ${
            isOda
              ? hasImage
                ? "bg-gradient-to-br from-accent/10 via-accent/5 to-accent/10 shadow-lg border border-accent/10 group-hover:shadow-xl"
                : "bg-gradient-to-br from-accent/5 to-accent/10 group-hover:from-accent/10 group-hover:to-accent/15"
              : "bg-gradient-to-br from-gray-50 to-gray-50/50 group-hover:from-gray-100/80 group-hover:to-gray-50/80"
          }`}
        >
          <div className="space-y-4">
            {type === "text" ? (
              <TextFormatter
                text={content}
                searchMode={searchMode}
                searchTerm={searchTerm}
              />
            ) : type === "image" ? (
              <ImageDisplay
                src={content.url}
                alt={content.alt || `${author}'s illustration`}
                caption={content.caption}
                className="max-w-md mx-auto"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
