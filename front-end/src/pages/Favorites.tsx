import { useFavorites } from '../contexts/FavoritesContext';

import { useLanguage } from '../contexts/LanguageContext';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

const Favorites = () => {
  const { state: favoritesState, dispatch: favoritesDispatch } = useFavorites();
    const { t } = useLanguage();

  const addToCart = (item: any) => {
    cartDispatch({
      type: 'ADD_ITEM',
      payload: item
    });
  };

  const removeFromFavorites = (itemId: string) => {
    favoritesDispatch({
      type: 'REMOVE_FAVORITE',
      payload: itemId
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('favorites.title')}</h1>
      
      {favoritesState.items.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>{t('favorites.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoritesState.items.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-primary">
                    {item.price} {t('common.currency')}
                  </span>
                  <span className={`text-sm ${item.inStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.inStock > 0 ? `${t('product.inStock')} (${item.inStock})` : t('product.outOfStock')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    
                    disabled={item.inStock === 0}
                  >
                    <FaShoppingCart />
                    {t('product.addToCart')}
                  </button>
                  <button
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    onClick={() => removeFromFavorites(item._id)}
                    title={t('favorites.remove')}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;


