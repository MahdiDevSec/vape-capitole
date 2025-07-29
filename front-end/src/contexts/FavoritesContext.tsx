import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Product, Liquid } from '../types';

type FavoriteItem = Product | Liquid;

interface FavoritesState {
  items: FavoriteItem[];
}

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: FavoriteItem }
  | { type: 'REMOVE_FAVORITE'; payload: string };

const initialState: FavoritesState = {
  items: [],
};

const FavoritesContext = createContext<{
  state: FavoritesState;
  dispatch: React.Dispatch<FavoritesAction>;
} | null>(null);

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      if (state.items.some(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case 'REMOVE_FAVORITE': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    }
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  return (
    <FavoritesContext.Provider value={{ state, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
