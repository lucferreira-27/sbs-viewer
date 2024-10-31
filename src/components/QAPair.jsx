import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faImage,
  faQuoteRight,
  faSpinner,
  faSearch,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

import { extractWikiImageUrl } from "../utils/imageUtils";

function formatText(text) {
  if (text === "N/A") return <em className="text-gray-400">N/A</em>;

  // Handle wiki links first (preserve existing functionality)
  text = text.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
    const [link, title] = p1.split("|");
    return `<a href="https://onepiece.fandom.com/wiki/${link}" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline decoration-2 decoration-accent/30">${
      title || link
    }</a>`;
  });

  // Handle bold text with ** markers
  text = text.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-bold text-gray-900">$1</strong>'
  );

  // Handle emphasis/italics with * or _ markers
  text = text.replace(
    /(\*|_)(.*?)\1/g,
    '<em class="text-gray-800 italic">$2</em>'
  );

  // Handle exclamation marks for emphasis
  text = text.replace(
    /(!{2,})/g,
    '<span class="font-semibold text-gray-900">$1</span>'
  );

  // Handle question marks for emphasis
  text = text.replace(
    /(\?{2,})/g,
    '<span class="font-semibold text-gray-900">$1</span>'
  );

  // Handle big text (preserve existing functionality)
  text = text.replace(
    /<big>(.*?)<\/big>/g,
    '<span class="text-lg font-bold">$1</span>'
  );

  // Add proper spacing after punctuation
  text = text.replace(/([.!?])([^\s"])/g, "$1 $2");

  return (
    <span
      className="prose prose-gray max-w-none prose-strong:text-gray-900 prose-em:text-gray-800"
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  );
}

function ImageWithPlaceholder({ src, alt, caption, className = "" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // Start with null instead of src

  useEffect(() => {
    async function loadImage() {
      if (src.includes("onepiece.fandom.com")) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `http://localhost:3001/api/wiki-image?url=${src}`
          );
          const data = await response.json();

          if (data.imageUrl) {
            setImageUrl(data.imageUrl);
            setHasError(false);
          } else {
            console.error("No image URL returned from API");
            setHasError(true);
          }
        } catch (error) {
          console.error("Error loading wiki image:", error);
          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      } else {
        // For non-wiki images, use the src directly
        setImageUrl(src);
        setIsLoading(false);
      }
    }

    loadImage();
  }, [src]);

  return (
    <figure className="relative">
      <div
        className={`relative ${className} min-h-[200px] bg-gray-50 rounded-lg overflow-hidden`}
      >
        {/* Loading State */}
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
                loadImage(); // Retry loading the image
              }}
              className="mt-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Actual Image - Only render if we have a valid imageUrl */}
        {imageUrl && (
          <img
            src={imageUrl}
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
        )}
      </div>
      {caption && (
        <figcaption className="text-sm text-gray-500 text-center mt-3 px-4">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function MessageBubble({
  author,
  content,
  type = "text",
  isOda = false,
  hasImage = false,
}) {
  // Helper function to determine which avatar to show
  const getAvatar = () => {
    if (isOda) {
      // If it's Oda, use his picture
      return (
        <img
          src={hasImage ? "/oda/drawing.png" : "/oda/picture.png"}
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

      {/* Content - Updated styling */}
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
          {/* Updated pointer styling */}
          <div
            className={`absolute left-[-10px] top-6 w-5 h-5 transform rotate-45 transition-colors ${
              isOda
                ? hasImage
                  ? "bg-accent/10"
                  : "bg-accent/5 group-hover:bg-accent/10"
                : "bg-gray-50 group-hover:bg-gray-100/80"
            }`}
          ></div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  hasImage
                    ? "bg-accent/10 text-accent/80"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {isOda
                  ? `${author || "Oda"}'s ${
                      hasImage ? "Illustration" : "Response"
                    }`
                  : author || "Fan Question"}
              </span>
              <FontAwesomeIcon
                icon={faQuoteRight}
                className={`${
                  hasImage ? "text-accent/30" : "text-accent/20"
                } group-hover:scale-110 transition-transform`}
              />
            </div>
            {type === "text" ? (
              <p className="text-gray-700 leading-relaxed tracking-wide">
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

function QAPair({ section, searchMode = false, searchTerm = "" }) {
  console.log("📝 QAPair received:", { section, searchMode, searchTerm });

  if (!section || section.type !== "q&a") {
    console.log("❌ Invalid section data:", section);
    return null;
  }

  const { question, answer, id, images } = section;
  console.log("📄 QAPair content:", { question, answer, id, images });

  // Check if this QA pair has images
  const hasImages = images && images.length > 0;

  // Helper function to highlight search terms in text
  const highlightText = (text) => {
    if (!searchMode || !searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(
      regex,
      '<mark class="bg-accent/20 text-accent">$1</mark>'
    );
  };

  // Organize all messages in chronological order
  const messages = [
    // Initial question
    {
      author: question?.author,
      content: question?.text ? highlightText(question.text) : "",
      type: "text",
      isOda: false,
      hasImage: false,
    },
    // Question images
    ...(images
      ?.filter((img) => img.type === "question")
      .map((img) => ({
        author: question?.author,
        content: img,
        type: "image",
        isOda: false,
        hasImage: true,
      })) || []),
    // Answer segments as separate messages
    ...(answer?.segments?.map((segment) => ({
      author: segment.author || answer.author,
      content: segment.type === "text" ? highlightText(segment.text) : segment,
      type: segment.type,
      isOda: segment.author === "Oda",
      hasImage: segment.type === "image",
    })) || []),
    // Additional answer/illustration images
    ...(images
      ?.filter((img) => ["answer", "illustration"].includes(img.type))
      .map((img) => ({
        author: img.author || answer?.author,
        content: img,
        type: "image",
        isOda: answer?.author === "Oda",
        hasImage: true,
      })) || []),
  ].filter(Boolean); // Remove any null/undefined messages

  console.log("📨 Processed messages:", messages);

  return (
    <div className={`space-y-8 ${searchMode ? "search-highlight" : ""}`}>
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          author={message.author}
          content={message.content}
          type={message.type}
          isOda={message.isOda}
          hasImage={message.hasImage}
        />
      ))}
    </div>
  );
}

export default QAPair;
