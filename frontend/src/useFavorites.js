import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'favorites';

// Only keep what a card needs, so localStorage stays small
// (no L_Remarks, no 100 other columns).
const SNAPSHOT_FIELDS = [
  'L_ListingID',
  'L_Photos',
  'L_SystemPrice',
  'L_Address',
  'L_City',
  'L_State',
  'L_Zip',
  'L_Keyword2',
  'LM_Dec_3',
  'LM_Int2_3',
];

function toSnapshot(property) {
  return Object.fromEntries(SNAPSHOT_FIELDS.map((key) => [key, property[key] ?? null]));
}

// Never throws: missing, corrupted or wrong-shaped data becomes []
function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((p) => p && p.L_ListingID) : [];
  } catch {
    return [];
  }
}

const FavoritesContext = createContext(null);

// All components share ONE favorites list through this provider, so the heart
// on a card, the count in the nav and the Favorites page always agree.
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // storage full or blocked: the app still works for this session
    }
  }, [favorites]);

  const isFavorite = (id) => favorites.some((p) => p.L_ListingID === id);

  function toggleFavorite(property) {
    setFavorites((prev) =>
      prev.some((p) => p.L_ListingID === property.L_ListingID)
        ? prev.filter((p) => p.L_ListingID !== property.L_ListingID)
        : [...prev, toSnapshot(property)]
    );
  }

  const value = { favorites, count: favorites.length, isFavorite, toggleFavorite };
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside <FavoritesProvider>');
  }
  return context;
}