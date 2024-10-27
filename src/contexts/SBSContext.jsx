import React, { createContext, useContext, useState, useEffect } from "react";
const API_BASE_URL = "http://localhost:3001/api/sbs";

const SBSContext = createContext();

export function SBSProvider({ children }) {
  const [sbs_data, setSBSData] = useState({});
  const [currentVolume, setCurrentVolume] = useState(107);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [availableVolumes, setAvailableVolumes] = useState([]);

  // Log volumes response
  useEffect(() => {
    fetch(`${API_BASE_URL}/volumes`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Volumes Response:", data);
        const volumes = data.map((vol) => vol.volume);
        setAvailableVolumes(volumes);
      })
      .catch((err) => console.error("Error fetching volumes:", err));
  }, []);

  // Log volume data response
  useEffect(() => {
    fetch(`${API_BASE_URL}/volumes/${currentVolume}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Volume Data Response:", data);
        setSBSData((prev) => ({ ...prev, [currentVolume]: data }));
      })
      .catch((err) => console.error("Error fetching volume data:", err));
  }, [currentVolume]);

  // Handle search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setIsSearching(true);
        // Use the character search endpoint as an example
        fetch(
          `${API_BASE_URL}/search/character/${encodeURIComponent(searchTerm)}`
        )
          .then((res) => res.json())
          .then((data) => {
            setFilteredData(data);
            setIsSearching(false);
          })
          .catch((err) => {
            console.error("Error searching:", err);
            setIsSearching(false);
          });
      } else {
        // When no search term, show current volume data
        setFilteredData(sbs_data[currentVolume]?.chapters || []);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, currentVolume, sbs_data]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 300);
  };

  return (
    <SBSContext.Provider
      value={{
        sbs_data,
        currentVolume,
        setCurrentVolume,
        searchTerm,
        handleSearch,
        filteredData,
        isTyping,
        isSearching,
        availableVolumes,
      }}
    >
      {children}
    </SBSContext.Provider>
  );
}

export function useSBS() {
  return useContext(SBSContext);
}
