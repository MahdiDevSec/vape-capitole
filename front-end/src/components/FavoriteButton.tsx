import { FaHeart } from 'react-icons/fa';
import { useFavorites } from '../contexts/FavoritesContext';
import type { Product, Liquid } from '../types';

interface FavoriteButtonProps {
  item: Product | Liquid;
}

const FavoriteButton = ({ item }: FavoriteButtonProps) => {
  const { state, dispatch } = useFavorites();
  const isFavorite = state.items.some(favItem => favItem.id === item.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: item.id });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: item });
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className="absolute top-2 right-2 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <FaHeart
        className={isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
        size={20}
      />
    </button>
  );
};

export default FavoriteButton;
