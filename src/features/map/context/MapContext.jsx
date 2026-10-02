"use client";

import { createContext, useContext, useState, useCallback } from "react";

const MapContext = createContext({
  map: null,
  setMap: () => {},
  isLoaded: false,
  setIsLoaded: () => {},
});

export function MapProvider({ children }) {
  const [map, setMapState] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const setMap = useCallback((mapInstance) => {
    setMapState(mapInstance);
  }, []);

  return (
    <MapContext.Provider value={{ map, setMap, isLoaded, setIsLoaded }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
