"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface FavoritesContextType {
  favorites: string[];
  favoritesCount: number;
  isLoaded: boolean;
  isFavorite: (id: string | number) => boolean;
  toggleFavorite: (id: string | number) => void;
  addFavorite: (id: string | number) => void;
  removeFavorite: (id: string | number) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = "showroom_favorites";
const LEGACY_STORAGE_KEY = "favorites";
const CUSTOM_EVENT_NAME = "showroom_favorites_change";

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed.map(String));
        }
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
    setIsLoaded(true);
  }, []);

  // Synchronize across tabs and within the same page
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === LEGACY_STORAGE_KEY) {
        try {
          const parsed = event.newValue ? JSON.parse(event.newValue) : [];
          if (Array.isArray(parsed)) {
            setFavorites(parsed.map(String));
          }
        } catch {}
      }
    };

    const handleCustom = (event: Event) => {
      const customEvent = event as CustomEvent<string[]>;
      if (Array.isArray(customEvent.detail)) {
        setFavorites(customEvent.detail.map(String));
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(CUSTOM_EVENT_NAME, handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CUSTOM_EVENT_NAME, handleCustom);
    };
  }, []);

  const persist = useCallback((newList: string[]) => {
    try {
      const json = JSON.stringify(newList);
      localStorage.setItem(STORAGE_KEY, json);
      localStorage.setItem(LEGACY_STORAGE_KEY, json);
      window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME, { detail: newList }));
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  }, []);

  const isFavorite = useCallback(
    (id: string | number) => {
      return favorites.includes(String(id));
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (id: string | number) => {
      const strId = String(id);
      setFavorites((prev) => {
        const next = prev.includes(strId)
          ? prev.filter((item) => item !== strId)
          : [...prev, strId];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const addFavorite = useCallback(
    (id: string | number) => {
      const strId = String(id);
      setFavorites((prev) => {
        if (prev.includes(strId)) return prev;
        const next = [...prev, strId];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeFavorite = useCallback(
    (id: string | number) => {
      const strId = String(id);
      setFavorites((prev) => {
        if (!prev.includes(strId)) return prev;
        const next = prev.filter((item) => item !== strId);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    persist([]);
  }, [persist]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        isLoaded,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
