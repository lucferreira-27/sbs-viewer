import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faImage } from "@fortawesome/free-solid-svg-icons";

function ImageDisplay({ src, alt, caption, className = "" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

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
        {isLoading && <LoadingState />}
        {hasError && <ErrorState onRetry={() => loadImage()} />}
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

function LoadingState() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-2">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-accent text-xl animate-spin"
        />
      </div>
      <span className="text-sm text-gray-400">Loading image...</span>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
        <FontAwesomeIcon icon={faImage} className="text-red-400 text-xl" />
      </div>
      <span className="text-sm text-gray-600 text-center">
        Unable to load image
      </span>
      <button
        onClick={onRetry}
        className="mt-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

export default ImageDisplay;
