// Ride Context for managing search state and active trips

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SearchFilters, RideSearchResult, Match, Ride } from '../types';

interface RideContextType {
  lastSearch: SearchFilters | null;
  setLastSearch: (search: SearchFilters | null) => void;
  searchResults: RideSearchResult[];
  setSearchResults: (results: RideSearchResult[]) => void;
  activeMatch: Match | null;
  setActiveMatch: (match: Match | null) => void;
  activeCreatedRide: Ride | null;
  setActiveCreatedRide: (ride: Ride | null) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider = ({ children }: { children: ReactNode }) => {
  const [lastSearch, setLastSearch] = useState<SearchFilters | null>(null);
  const [searchResults, setSearchResults] = useState<RideSearchResult[]>([]);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [activeCreatedRide, setActiveCreatedRide] = useState<Ride | null>(null);

  return (
    <RideContext.Provider
      value={{
        lastSearch,
        setLastSearch,
        searchResults,
        setSearchResults,
        activeMatch,
        setActiveMatch,
        activeCreatedRide,
        setActiveCreatedRide,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRideContext = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRideContext must be used within a RideProvider');
  }
  return context;
};
