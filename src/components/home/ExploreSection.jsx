import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faUser,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function ExploreSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 mb-16">
      <h2 className="text-xl font-bold text-ink text-center mb-8">
        Explore More
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExploreCard
          to="/search"
          icon={faSearch}
          title="Search SBS"
          description="Search through all SBS questions and answers with our powerful search feature."
        />

        <ExploreCard
          to="/browse"
          icon={faFilter}
          title="Browse Content"
          description="Explore SBS content organized by volumes and chapters."
        />

        <ExploreCard
          icon={faUser}
          title="Character Info"
          description="Detailed character profiles and information from SBS sections."
          comingSoon
        />
      </div>
    </section>
  );
}

function ExploreCard({ to, icon, title, description, comingSoon }) {
  const CardWrapper = to ? Link : 'div';
  
  return (
    <CardWrapper
      to={to}
      className="group relative p-8 bg-white rounded-2xl border border-gray-100
                 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                 transition-all duration-300"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center
                         group-hover:bg-accent/10 transition-colors duration-200">
            <FontAwesomeIcon
              icon={icon}
              className="text-2xl text-accent"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-ink group-hover:text-accent transition-colors">
              {title}
            </h3>
          </div>
          {comingSoon ? (
            <div className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
              Coming Soon
            </div>
          ) : (
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-accent/40 group-hover:text-accent group-hover:translate-x-1
                         transition-all duration-200 opacity-0 group-hover:opacity-100"
            />
          )}
        </div>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </CardWrapper>
  );
}

export default ExploreSection;
