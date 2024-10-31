import { useState, useEffect } from "react";

export function useDebugger(initialData = {}) {
  const [debug, setDebug] = useState({
    ...initialData,
    startTime: Date.now(),
    updates: 0,
  });

  const updateDebug = (newData) => {
    setDebug((prev) => ({
      ...prev,
      ...newData,
      updates: prev.updates + 1,
      lastUpdate: Date.now(),
    }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDebug((prev) => ({
        ...prev,
        elapsedTime: `${((Date.now() - prev.startTime) / 1000).toFixed(1)}s`,
      }));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return [debug, updateDebug];
}
