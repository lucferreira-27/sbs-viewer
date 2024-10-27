import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faImage,
  faQuoteRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

function formatText(text) {
  if (text === "N/A") return <em className="text-gray-400">N/A</em>;

  text = text.replace(
    /<big>(.*?)<\/big>/g,

    '<span class="text-lg font-bold">$1</span>'
  );

  text = text.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
    const [link, title] = p1.split("|");

    return `<a href="https://onepiece.fandom.com/wiki/${link}" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline decoration-2 decoration-accent/30">

      ${title || link}

    </a>`;
  });

  return <span dangerouslySetInnerHTML={{ __html: text }} />;
}

function ImageWithPlaceholder({ src, alt, caption, className = "" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <figure className="relative">
      <div
        className={`relative ${className} min-h-[200px] bg-gray-50 rounded-lg overflow-hidden`}
      >
        {/* Placeholder/Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-2">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-accent text-xl animate-spin"
              />
            </div>
            <span className="text-sm text-gray-400">Loading image...</span>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <FontAwesomeIcon
                icon={faImage}
                className="text-red-400 text-xl"
              />
            </div>
            <span className="text-sm text-gray-600 text-center">
              Unable to load image
            </span>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                const img = new Image();
                img.src = src;
                img.onload = () => setIsLoading(false);
                img.onerror = () => setHasError(true);
              }}
              className="mt-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Actual Image */}
        <img
          src={src}
          alt={alt}
          className={`rounded-lg w-full h-full object-contain ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-all duration-500`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-gray-500 text-center mt-3 px-4">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function MessageBubble({ author, content, type = "text", isOda = false }) {
  // Helper function to determine which avatar to show
  const getAvatar = () => {
    if (isOda) {
      // If it's Oda, use his picture
      return (
        <img
          src="/oda/picture.png"
          alt="Eiichiro Oda"
          className="w-full h-full object-cover"
        />
      );
    } else if (author) {
      // Try to load author's picture from public/characters folder
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
      // Default user icon for unknown authors
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
          <FontAwesomeIcon icon={faUser} className="text-xl text-accent" />
        </div>
      );
    }
  };

  return (
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-xl overflow-hidden border-2 ${
            isOda ? "border-accent shadow-md" : "border-accent/20"
          }`}
        >
          {getAvatar()}
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs font-medium text-accent">
            {author || (isOda ? "Oda" : "Guest")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <div
          className={`rounded-2xl p-4 relative ${
            isOda
              ? "bg-gradient-to-br from-accent/5 to-accent/10"
              : "bg-gradient-to-br from-gray-50 to-gray-50/50"
          }`}
        >
          <div
            className={`absolute left-[-8px] top-4 w-4 h-4 transform rotate-45 ${
              isOda ? "bg-accent/5" : "bg-gray-50"
            }`}
          ></div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {isOda
                  ? `${author || "Oda"}'s Response`
                  : author || "Fan Question"}
              </span>
              <FontAwesomeIcon icon={faQuoteRight} className="text-accent/20" />
            </div>
            {type === "text" ? (
              <p className="text-gray-800 leading-relaxed">
                {formatText(content)}
              </p>
            ) : type === "image" ? (
              <ImageWithPlaceholder
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

function QAPair({ section, compact = false }) {
  if (!section || section.type !== "q&a") return null;

  const { question, answer, id, images } = section;

  // Organize all messages in chronological order
  const messages = [
    // Initial question
    {
      author: question.author,
      content: question.text,
      type: "text",
      isOda: false,
    },
    // Question images
    ...(images
      ?.filter((img) => img.type === "question")
      .map((img) => ({
        author: question.author,
        content: img,
        type: "image",
        isOda: false,
      })) || []),
    // Answer segments as separate messages
    ...answer.segments.map((segment) => ({
      author: segment.author || answer.author,
      content: segment.type === "text" ? segment.text : segment,
      type: segment.type,
      isOda: segment.author === "Oda",
    })),
    // Additional answer/illustration images
    ...(images
      ?.filter((img) => ["answer", "illustration"].includes(img.type))
      .map((img) => ({
        author: img.author || answer.author,
        content: img,
        type: "image",
        isOda: answer.author === "Oda",
      })) || []),
  ];

  return (
    <div className={`${compact ? "p-4" : "p-6"}`}>
      {/* Question ID */}
      <div className="mb-4">
        <span className="text-xs font-medium text-accent">
          Q{id.split("-").pop().substring(1)}
        </span>
      </div>

      {/* Messages */}
      <div className="space-y-6">
        {messages.map((message, index) =>
          !compact || index === 0 || (index === 1 && message.isOda) ? (
            <MessageBubble
              key={index}
              author={message.author}
              content={message.content}
              type={message.type}
              isOda={message.isOda}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

export default QAPair;
