import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import type { Product, Liquid } from '../types';
import { productsData, liquidsData } from '../data';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchResult {
  type: 'product' | 'liquid';
  item: Product | Liquid;
}

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const matchedProducts = productsData
      .filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      )
      .map(product => ({ type: 'product' as const, item: product }));

    const matchedLiquids = liquidsData
      .filter(liquid =>
        liquid.name.toLowerCase().includes(searchTerm) ||
        liquid.description.toLowerCase().includes(searchTerm) ||
        liquid.category.toLowerCase().includes(searchTerm)
      )
      .map(liquid => ({ type: 'liquid' as const, item: liquid }));

    setResults([...matchedProducts, ...matchedLiquids]);
  }, [query]);

  return (
    <div className="relative">
      <div className="flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('search.placeholder')}
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto z-50">
            {results.map(({ type, item }) => (
              <a
                key={item._id}
                href={type === 'product' ? `/products/${item._id}` : `/liquids/${item._id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {type === 'product' ? item.description : `${item.volume}ml, ${item.nicotineLevel}mg`}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {item.price} {t('common.currency')}
                  </p>
                </div>
                <span className="text-xs text-gray-500 capitalize">
                  {type === 'product' ? t('search.product') : t('search.liquid')}
                </span>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
