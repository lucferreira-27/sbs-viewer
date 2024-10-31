import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function SearchFilters({ searchTerm, searchStats }) {
  if ((!searchTerm || !searchStats)) {
    return (
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 max-w-3xl mx-auto">
        <div className="flex items-start gap-3 text-sm">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-blue-500 mt-1"
          />
          <ul className="text-blue-600 space-y-1">
            <li>• Use keywords related to characters, places, or events</li>
            <li>• Try variations like "Luffy" or "Monkey D. Luffy"</li>
            <li>• Search specific topics like "Devil Fruit" or "birthday"</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
}

export default SearchFilters;
