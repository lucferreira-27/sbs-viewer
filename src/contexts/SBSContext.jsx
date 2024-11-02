import React, { createContext, useContext, useState, useEffect } from "react";
import { buildApiUrl } from "../config/api";
import { debug } from "../utils/debug";

const SBSContext = createContext();

export function SBSProvider({ children }) {
  const [sbs_data, setSBSData] = useState({});
  const [currentVolume, setCurrentVolume] = useState(107);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("text");
  const [searchResults, setSearchResults] = useState(null);
  const [availableVolumes, setAvailableVolumes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [volumeTags, setVolumeTags] = useState(null);
  const [searchStats, setSearchStats] = useState(null);
  const [loadedVolumes, setLoadedVolumes] = useState(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch available volumes
  useEffect(() => {
    debug.group("SBSContext", () => {
      debug.log("SBSContext", "Fetching available volumes...", "info");
    });

    fetch(buildApiUrl("/volumes"))
      .then((res) => res.json())
      .then((data) => {
        const volumes = data.map((vol) => vol.volume);
        debug.log(
          "SBSContext",
          {
            action: "Volumes Fetched",
            count: volumes.length,
            volumes,
          },
          "success"
        );
        setAvailableVolumes(volumes);
      })
      .catch((err) => {
        debug.log(
          "SBSContext",
          {
            action: "Volumes Fetch Failed",
            error: err.message,
          },
          "error"
        );
      });
  }, []);

  // Fetch current volume data
  useEffect(() => {
    debug.group("SBSContext", () => {
      debug.log(
        "SBSContext",
        {
          action: "Fetching volume data",
          volume: currentVolume,
        },
        "info"
      );
    });

    fetch(buildApiUrl(`/volumes/${currentVolume}`))
      .then((res) => res.json())
      .then((data) => {
        debug.log(
          "SBSContext",
          {
            action: "Volume Data Fetched",
            volume: currentVolume,
            chaptersCount: data.chapters?.length,
          },
          "success"
        );
        setSBSData((prev) => ({ ...prev, [currentVolume]: data }));
      })
      .catch((err) => {
        debug.log(
          "SBSContext",
          {
            action: "Volume Data Fetch Failed",
            volume: currentVolume,
            error: err.message,
          },
          "error"
        );
      });
  }, [currentVolume]);

  // Fetch volume tags
  useEffect(() => {
    async function fetchVolumeTags() {
      debug.log(
        "SBSContext",
        {
          action: "Fetching volume tags",
          volume: currentVolume,
        },
        "info"
      );

      try {
        const response = await fetch(
          buildApiUrl(`/volumes/${currentVolume}/tags`)
        );
        const data = await response.json();
        debug.log(
          "SBSContext",
          {
            action: "Tags Fetched",
            volume: currentVolume,
            tagCount: data?.length || 0,
          },
          "success"
        );
        setVolumeTags(data);
      } catch (error) {
        debug.log(
          "SBSContext",
          {
            action: "Tags Fetch Failed",
            volume: currentVolume,
            error: error.message,
          },
          "error"
        );
      }
    }

    fetchVolumeTags();
  }, [currentVolume]);

  // Fetch volume data when needed
  const fetchVolumeData = async (volumeNumber) => {
    if (loadedVolumes.has(volumeNumber)) {
      debug.log(
        "SBSContext",
        {
          action: "Skip Volume Load",
          volume: volumeNumber,
          reason: "Already loaded",
        },
        "info"
      );
      return;
    }

    try {
      debug.log(
        "SBSContext",
        {
          action: "Loading Volume",
          volume: volumeNumber,
        },
        "info"
      );

      const response = await fetch(buildApiUrl(`/volumes/${volumeNumber}`));
      const data = await response.json();

      debug.log(
        "SBSContext",
        {
          action: "Volume Loaded",
          volume: volumeNumber,
          chaptersCount: data.chapters?.length,
        },
        "success"
      );

      setSBSData((prev) => ({ ...prev, [volumeNumber]: data }));
      setLoadedVolumes((prev) => new Set(prev).add(volumeNumber));
    } catch (error) {
      debug.log(
        "SBSContext",
        {
          action: "Volume Load Failed",
          volume: volumeNumber,
          error: error.message,
        },
        "error"
      );
    }
  };

  // Search function
  const performSearch = async (term, type = "text") => {
    debug.group("SBSContext", () => {
      debug.log(
        "SBSContext",
        {
          action: "Starting Search",
          term,
          type,
        },
        "info"
      );
    });

    if (!term) {
      setSearchResults(null);
      setSearchStats(null);
      return;
    }

    setIsSearching(true);
    try {
      const searchUrl = buildApiUrl(
        `/search/${type}/${encodeURIComponent(term)}`
      );
      const response = await fetch(searchUrl);
      const data = await response.json();

      const stats = {
        totalMatches: 0,
        volumeCount: 0,
        volumes: {},
      };

      data.forEach((volumeResult) => {
        const matchCount = volumeResult.matches.length;
        if (matchCount > 0) {
          stats.totalMatches += matchCount;
          stats.volumeCount++;
          stats.volumes[volumeResult.volume] = matchCount;
        }
      });

      debug.log(
        "SBSContext",
        {
          action: "Search Complete",
          results: data.length,
          stats,
        },
        "success"
      );

      setSearchStats(stats);
      setSearchResults(data);

      // Fetch first batch of volumes
      const firstBatchVolumes = data.slice(0, 3).map((v) => v.volume);
      await Promise.all(firstBatchVolumes.map(fetchVolumeData));
    } catch (error) {
      debug.log(
        "SBSContext",
        {
          action: "Search Failed",
          error: error.message,
        },
        "error"
      );
      setSearchResults(null);
      setSearchStats(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Load more results
  const loadMoreResults = async () => {
    if (!searchResults || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const loadedCount = Array.from(loadedVolumes).length;
      const nextBatch = searchResults
        .slice(loadedCount, loadedCount + 3)
        .map((v) => v.volume);

      if (nextBatch.length > 0) {
        await Promise.all(nextBatch.map(fetchVolumeData));
      }
    } catch (error) {
      console.error("Error loading more results:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Process search results into filtered data format
  const filteredData = searchResults
    ? processSearchResults(searchResults, searchType)
    : sbs_data;

  function processSearchResults(results, type) {
    console.log("🔄 Processing results for type:", type);
    console.log("📥 Input results:", results);

    let processed;
    switch (type) {
      case "character":
        processed = processCharacterResults(results);
        break;
      case "tag":
        processed = results;
        break;
      default:
        processed = processTextResults(results);
        break;
    }

    console.log("📤 Processed results:", processed);
    return processed;
  }

  function processTextResults(results) {
    console.log("📝 Processing text results:", results);

    if (!results || !Array.isArray(results)) {
      console.log("❌ Invalid results format");
      return [];
    }

    // Get the full section data from sbs_data
    const processed = results
      .map((volumeResult) => {
        console.log("📚 Processing volume:", volumeResult);
        const { volume, matches } = volumeResult;

        // Get volume data
        const volumeData = sbs_data[volume];
        console.log("📗 Volume data:", volumeData);

        if (!volumeData) return null;

        // Group matches by chapter
        const chapterMatches = matches.reduce((acc, match) => {
          console.log("📖 Processing match:", match);
          const { chapter, page, sectionId, matchedIn } = match;

          // Find the full section data
          const fullSection = volumeData.chapters
            ?.find((c) => c.chapter === chapter)
            ?.sections?.find((s) => s.id === sectionId);

          console.log("📄 Found section:", fullSection);

          if (!fullSection) return acc;

          if (!acc[chapter]) {
            acc[chapter] = {
              chapter,
              page,
              sections: [],
            };
          }

          // Add the full section data with search match info
          acc[chapter].sections.push({
            ...fullSection,
            matchedIn,
            isSearchMatch: true,
          });

          return acc;
        }, {});

        const chapters = Object.values(chapterMatches);
        console.log("📑 Processed chapters for volume:", { volume, chapters });

        return {
          volume,
          chapters,
        };
      })
      .filter(Boolean); // Remove null results

    console.log("✅ Final processed results:", processed);
    return processed;
  }

  useEffect(() => {
    // Load initial volumes
    const loadInitialVolumes = async () => {
      try {
        const response = await fetch(buildApiUrl("/volumes"));
        const data = await response.json();
        const volumes = data.map((vol) => vol.volume);
        setAvailableVolumes(volumes);

        // Load first few volumes data
        const initialVolumes = volumes.slice(0, 5);
        await Promise.all(
          initialVolumes.map(async (volume) => {
            const volumeResponse = await fetch(
              buildApiUrl(`/volumes/${volume}`)
            );
            const volumeData = await volumeResponse.json();
            setSBSData((prev) => ({ ...prev, [volume]: volumeData }));
          })
        );
      } catch (err) {
        console.error("Error loading initial volumes:", err);
      }
    };

    loadInitialVolumes();
  }, []);

  return (
    <SBSContext.Provider
      value={{
        sbs_data,
        setSBSData,
        currentVolume,
        setCurrentVolume,
        searchTerm,
        setSearchTerm,
        searchType,
        setSearchType,
        performSearch,
        filteredData,
        availableVolumes,
        isSearching,
        volumeTags,
        searchStats,
        loadMoreResults,
        isLoadingMore,
        loadedVolumes: Array.from(loadedVolumes),
      }}
    >
      {children}
    </SBSContext.Provider>
  );
}

export function useSBS() {
  const context = useContext(SBSContext);
  if (!context) {
    debug.log("SBSContext", "useSBS called outside of SBSProvider", "error");
    throw new Error("useSBS must be used within an SBSProvider");
  }
  return context;
}

// Helper functions for processing search results
function processCharacterResults(results) {
  if (!results) return [];

  const { taggedAppearances = [], textMentions = [] } = results;
  const processedData = [];

  // Helper to process appearances/mentions
  const processEntries = (entries, source) => {
    entries.forEach(({ volume, appearances }) => {
      let volumeData = processedData.find((v) => v.volume === volume);
      if (!volumeData) {
        volumeData = { volume, chapters: [] };
        processedData.push(volumeData);
      }

      // Group by chapter
      const chapterGroups = appearances.reduce((acc, app) => {
        const { chapter, page, sectionId } = app;
        if (!acc[chapter]) {
          acc[chapter] = {
            chapter,
            page,
            sections: [],
          };
        }

        acc[chapter].sections.push({
          id: sectionId,
          type: "q&a",
          matchSource: source,
          isSearchMatch: true,
        });

        return acc;
      }, {});

      // Add chapters to volume data
      volumeData.chapters.push(...Object.values(chapterGroups));
    });
  };

  // Process both types of matches
  processEntries(taggedAppearances, "tagged");
  processEntries(textMentions, "text");

  return processedData;
}
