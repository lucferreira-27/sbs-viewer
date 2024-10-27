import React from "react";
import { useSBS } from "../contexts/SBSContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";

function SearchBar() {
  const { searchTerm, handleSearch, isTyping, isSearching } = useSBS();

  return (
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search questions..."
        className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 
                 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                 transition-all duration-200 bg-white shadow-sm
                 placeholder:text-gray-400"
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
      </div>
      {(isTyping || isSearching) && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <FontAwesomeIcon icon={faSpinner} spin className="text-accent" />
        </div>
      )}
    </div>
  );
}

export default SearchBar;
