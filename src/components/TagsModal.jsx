import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faTimes,
  faSearch,
  faSpinner,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

function TagsModal({ isOpen, onClose, tags = [], onSelectTag, isLoading }) {
  const [searchFilter, setSearchFilter] = useState("");

  // Filter tags based on search
  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Get popular tags (just showing first 6)
  const popularTags = tags.slice(0, 6);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-start justify-center pointer-events-none">
        <div
          className="mt-32 bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[calc(100vh-160px)] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faTag} className="text-accent" />
                <h3 className="font-medium text-gray-900">Browse Tags</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-gray-400" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search tags..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 
                         focus:border-accent focus:ring-1 focus:ring-accent/10"
                autoFocus
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Content */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 320px)" }}
          >
            <div className="p-6 space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-accent animate-spin text-xl"
                  />
                </div>
              ) : (
                <>
                  {/* Popular Tags Section */}
                  {!searchFilter && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faChartBar}
                          className="text-xs"
                        />
                        Popular Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              onSelectTag(tag);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-full bg-accent/5 text-accent 
                                   hover:bg-accent/10 transition-colors text-sm font-medium
                                   flex items-center gap-2"
                          >
                            <FontAwesomeIcon icon={faTag} className="text-xs" />
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All/Filtered Tags */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          onSelectTag(tag);
                          onClose();
                        }}
                        className="text-left px-3 py-2 rounded-lg hover:bg-accent/5 
                               text-sm text-gray-700 hover:text-accent transition-colors
                               flex items-center gap-2 group"
                      >
                        <FontAwesomeIcon
                          icon={faTag}
                          className="text-gray-400 group-hover:text-accent transition-colors"
                        />
                        <span className="truncate">{tag}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              {filteredTags.length} tags available • Click on a tag to start
              searching
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default TagsModal;
