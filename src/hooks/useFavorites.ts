import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addFavorite, removeFavorite, toggleFavorite, clearFavorites } from '../redux/slices/favoritesSlice';
import { Event } from '../types';

interface UseFavoritesResult {
  favorites: Event[];
  isFavorite: (eventId: string) => boolean;
  addToFavorites: (event: Event) => void;
  removeFromFavorites: (eventId: string) => void;
  toggleEventFavorite: (event: Event) => void;
  clearAllFavorites: () => void;
  favoritesCount: number;
}

export const useFavorites = (): UseFavoritesResult => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.favorites);

  const isFavorite = useCallback(
    (eventId: string): boolean => favorites.some(e => e.id === eventId),
    [favorites],
  );

  const addToFavorites = useCallback(
    (event: Event) => {
      dispatch(addFavorite(event));
    },
    [dispatch],
  );

  const removeFromFavorites = useCallback(
    (eventId: string) => {
      dispatch(removeFavorite(eventId));
    },
    [dispatch],
  );

  const toggleEventFavorite = useCallback(
    (event: Event) => {
      dispatch(toggleFavorite(event));
    },
    [dispatch],
  );

  const clearAllFavorites = useCallback(() => {
    dispatch(clearFavorites());
  }, [dispatch]);

  return {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleEventFavorite,
    clearAllFavorites,
    favoritesCount: favorites.length,
  };
};
