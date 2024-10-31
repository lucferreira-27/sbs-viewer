import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faTag,
  faFont,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useSBS } from "../contexts/SBSContext";
import { debounce } from "lodash";
import TagsModal from "./TagsModal";
import { buildApiUrl } from "../config/api";

function SearchBar({ isFixed = false }) {
  const {
    searchTerm,
    setSearchTerm,
    performSearch,
    searchType,
    setSearchType,
    isSearching,
    volumeTags,
  } = useSBS();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.trim().length >= 2) {
        setSearchTerm(term);
        performSearch(term, searchType);
      } else if (term.trim().length === 0) {
        setSearchTerm("");
        performSearch("", searchType);
      }
    }, 500),
    [searchType]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  const searchTypes = [
    { id: "text", icon: faFont, label: "Text" },
    { id: "character", icon: faUser, label: "Character" },
    { id: "tag", icon: faTag, label: "Tag" },
  ];

  const hasValidTags = Array.isArray(volumeTags) && volumeTags.length > 0;

  // Function to fetch tags
  const fetchTags = async () => {
    setIsLoadingTags(true);
    try {
      const response = await fetch(buildApiUrl("/tags"));
      const data = await response.json();
      console.log("Fetched tags:", data); // Debug log
      setAvailableTags(data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  // Fetch tags when modal opens
  const handleOpenTagsModal = () => {
    setShowTagsModal(true);
    fetchTags(); // Fetch tags when modal opens
  };

  // Handle tag selection
  const handleTagSelect = (tag) => {
    setLocalSearchTerm(tag);
    setSearchTerm(tag);
    performSearch(tag, "tag");
    setSearchType("tag");
  };

  return (
    <div className={`relative ${isFixed ? "flex items-center" : ""}`}>
      {/* Search Input - Now comes first in fixed mode */}
      <div className={`relative ${isFixed ? "flex-grow" : ""}`}>
        <input
          type="text"
          value={localSearchTerm}
          onChange={handleInputChange}
          placeholder={`Search by ${searchType}...`}
          className={`w-full border border-gray-200 transition-all
            ${
              isFixed
                ? "px-10 py-2 rounded-lg text-sm focus:ring-1"
                : "px-4 py-3 pl-12 rounded-xl focus:ring-2"
            }
            focus:border-accent focus:ring-accent/10`}
          onFocus={() => setShowSuggestions(true)}
        />
        <div
          className={`absolute ${
            isFixed ? "left-3" : "left-4"
          } top-1/2 -translate-y-1/2`}
        >
          {isSearching ? (
            <FontAwesomeIcon
              icon={faSpinner}
              className="text-accent animate-spin"
            />
          ) : (
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Search Type Selector */}
      <div
        className={`
        ${isFixed ? "ml-2 flex-shrink-0" : "flex gap-2 mb-2"}
      `}
      >
        <div
          className={`flex rounded-lg ${
            isFixed ? "bg-gray-100/50" : "bg-gray-100"
          } p-1`}
        >
          {searchTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSearchType(type.id);
                if (type.id === "tag") {
                  handleOpenTagsModal();
                }
              }}
              className={`
                rounded-md flex items-center transition-colors
                ${isFixed ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm gap-2"}
                ${
                  searchType === type.id
                    ? isFixed
                      ? "bg-white text-accent shadow-sm"
                      : "bg-white text-accent shadow-sm"
                    : "text-gray-600 hover:text-accent"
                }
              `}
              title={type.label}
            >
              <FontAwesomeIcon icon={type.icon} />
              {!isFixed && <span>{type.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Modal */}
      <TagsModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        tags={availableTags}
        onSelectTag={handleTagSelect}
        isLoading={isLoadingTags}
      />

      {/* Tag Suggestions */}
      {showSuggestions && searchType === "tag" && hasValidTags && (
        <div
          className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 
                        max-h-60 overflow-y-auto z-50"
        >
          <div className="p-2">
            {volumeTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => {
                  setLocalSearchTerm(tag);
                  setSearchTerm(tag);
                  performSearch(tag, searchType);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent/5 
                           text-sm text-gray-700 hover:text-accent transition-colors"
              >
                <FontAwesomeIcon icon={faTag} className="mr-2 opacity-50" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No tags message */}
      {showSuggestions && searchType === "tag" && !hasValidTags && (
        <div className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500 text-center">
            No tags available for this volume
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
