import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../../types';

interface FavoritesState {
  favorites: Event[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Event>) => {
      const exists = state.favorites.some(e => e.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(e => e.id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<Event>) => {
      const index = state.favorites.findIndex(e => e.id === action.payload.id);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
    clearFavorites: state => {
      state.favorites = [];
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
