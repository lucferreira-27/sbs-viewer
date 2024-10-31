import React from "react";

import VolumeSelector from "./VolumeSelector";

import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path
      ? "bg-accent text-paper"
      : "hover:bg-accent/10";
  };

  return (
    <header className="bg-ink text-paper shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl font-bold hover:text-accent transition-colors"
            >
              One Piece SBS Viewer
            </Link>
          </div>

          <nav className="mt-4 md:mt-0">
            <ul className="flex flex-wrap gap-2 items-center">
              {[
                { path: "/", label: "Home" },

                { path: "/search", label: "Search" },

                { path: "/browse", label: "Browse" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActiveRoute(
                      path
                    )}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}

              <li className="ml-2">
                <VolumeSelector />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
