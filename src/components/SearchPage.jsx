import React from "react";
import SearchBar from "./SearchBar";
import SBSContent from "./SBSContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div
          className="inline-flex items-center justify-center w-16 h-16 
                      bg-accent/10 rounded-full mb-6"
        >
          <FontAwesomeIcon icon={faSearch} className="text-2xl text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-ink mb-4">Search SBS Content</h1>
        <p className="text-gray-600 mb-8">
          Search through all SBS questions and answers from Volume 107
        </p>
        <SearchBar />
      </div>

      {/* Search Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mt-1" />
          <div>
            <h3 className="font-medium text-blue-800 mb-1">Search Tips</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Use keywords related to characters, places, or events</li>
              <li>
                • Try different variations of names (e.g., "Luffy" or "Monkey D.
                Luffy")
              </li>
              <li>
                • Search for specific topics like "Devil Fruit" or "birthday"
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="min-h-[400px]">
        <SBSContent />
      </div>
    </div>
  );
}

export default SearchPage;
