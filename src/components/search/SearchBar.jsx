import React, { useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faTag,
  faFont,
  faSpinner,
  faTimes,
  faKeyboard,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { useSBS } from "../../contexts/SBSContext";
import { debounce } from "lodash";
import TagsModal from "./TagsModal";
import { buildApiUrl } from "../../config/api";

function SearchBar() {
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
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

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

  const fetchTags = async () => {
    setIsLoadingTags(true);
    try {
      const response = await fetch(buildApiUrl("/tags"));
      const data = await response.json();
      setAvailableTags(data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleOpenTagsModal = () => {
    setShowTagsModal(true);
    fetchTags();
  };

  const handleTagSelect = (tag) => {
    setLocalSearchTerm(tag);
    setSearchTerm(tag);
    performSearch(tag, "tag");
    setSearchType("tag");
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to clear search
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        e.preventDefault();
        handleClearSearch();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Save recent searches
  const saveRecentSearch = (term) => {
    if (term.trim() && !recentSearches.includes(term)) {
      const updated = [term, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    setSearchTerm("");
    performSearch("", searchType);
    inputRef.current?.focus();
  };

  const handleSearch = (term) => {
    setLocalSearchTerm(term);
    setSearchTerm(term);
    performSearch(term, searchType);
    saveRecentSearch(term);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      {/* Search Type Selector */}
      <div className="mb-3">
        <div className="inline-flex rounded-lg bg-white border border-gray-200 p-1 shadow-sm">
          {searchTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSearchType(type.id);
                if (type.id === "tag") handleOpenTagsModal();
                inputRef.current?.focus();
              }}
              className={`
                px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all
                ${
                  searchType === type.id
                    ? "bg-accent text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <FontAwesomeIcon icon={type.icon} className="text-[0.9em]" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative group">
        <div
          className={`
          relative rounded-2xl border transition-all duration-200
          ${
            isFocused
              ? "ring-2 ring-accent/10 border-accent shadow-lg"
              : "border-gray-200 shadow-sm"
          }
          ${!isFocused && "hover:border-accent/50 hover:shadow-md"}
        `}
        >
          <input
            ref={inputRef}
            type="text"
            value={localSearchTerm}
            onChange={handleInputChange}
            onFocus={() => {
              setShowSuggestions(true);
              setIsFocused(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
              setIsFocused(false);
            }}
            placeholder={`Search by ${searchType}...`}
            className="w-full px-5 py-4 pl-12 rounded-2xl bg-transparent
                     placeholder:text-gray-400 focus:outline-none"
          />

          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
                        group-hover:text-accent"
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

          {/* Keyboard Shortcut Indicator */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {localSearchTerm && (
              <button
                onClick={handleClearSearch}
                className="p-1.5 rounded-full hover:bg-gray-100 
                         text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
              </button>
            )}
            {!isFocused && (
              <div className="hidden sm:flex items-center text-xs text-gray-400 gap-1">
                <FontAwesomeIcon icon={faKeyboard} className="text-gray-300" />
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                  ⌘
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                  K
                </kbd>
              </div>
            )}
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions &&
          (recentSearches.length > 0 ||
            (searchType === "tag" && volumeTags?.length > 0)) && (
            <div
              className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 
                       max-h-80 overflow-y-auto z-50 animate-fade-in"
            >
              {recentSearches.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 flex items-center gap-2">
                    <FontAwesomeIcon icon={faHistory} />
                    Recent Searches
                  </div>
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(term)}
                      className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-accent/5 
                             text-sm text-gray-700 hover:text-accent transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="mr-2 opacity-50"
                      />
                      {term}
                    </button>
                  ))}
                </div>
              )}

              {/* Existing Tag Suggestions */}
              {searchType === "tag" && volumeTags?.length > 0 && (
                <div className="p-2">
                  {volumeTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagSelect(tag)}
                      className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-accent/5 
                             text-sm text-gray-700 hover:text-accent transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faTag}
                        className="mr-2 opacity-50"
                      />
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
      </div>

      {/* Tags Modal */}
      <TagsModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        tags={availableTags}
        onSelectTag={handleTagSelect}
        isLoading={isLoadingTags}
      />
    </div>
  );
}

export default SearchBar;
