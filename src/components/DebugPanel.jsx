import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBug,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

function DebugPanel({ data, title = "Debug Info", position = "bottom-right" }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position_, setPosition] = useState({ x: 0, y: 0 });

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    const rect = e.target.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    const panel = e.target;
    panel.style.left = `${e.clientX - position_.x}px`;
    panel.style.top = `${e.clientY - position_.y}px`;
  };

  return (
    <div
      className={`fixed ${
        positionClasses[position]
      } bg-black/80 text-white rounded-lg z-50
                 shadow-lg backdrop-blur-sm border border-white/10 transition-all duration-200
                 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{ minWidth: "280px", maxWidth: "400px" }}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      onMouseLeave={handleDragEnd}
    >
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBug} className="text-accent" />
          <h3 className="font-bold text-sm">{title}</h3>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-white/10 rounded"
        >
          <FontAwesomeIcon
            icon={isCollapsed ? faChevronDown : faChevronUp}
            className="text-xs"
          />
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 overflow-auto max-h-[500px]">
          <pre className="text-xs font-mono whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DebugPanel;
